#!/usr/bin/env node
/**
 * Nasazení statického exportu (out/) na Forpsi hosting přes FTPS.
 *
 *   node scripts/deploy-forpsi.mjs check           # ověří přihlášení, vypíše obsah
 *   node scripts/deploy-forpsi.mjs backup          # stáhne obsah /www do backups/
 *   node scripts/deploy-forpsi.mjs deploy          # nahraje out/ (nic nemaže)
 *   node scripts/deploy-forpsi.mjs deploy --wipe   # nejdřív smaže obsah /www
 *
 * Přihlašovací údaje patří do .env.local (necommituje se):
 *   FORPSI_FTP_HOST=ftp.proplan-klima.cz
 *   FORPSI_FTP_USER=...
 *   FORPSI_FTP_PASSWORD=...
 *   FORPSI_FTP_DIR=/www
 */
import { Client } from "basic-ftp";
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import readline from "node:readline/promises";

const ROOT = resolve(import.meta.dirname, "..");

// --- načtení .env.local / .env ---------------------------------------------
for (const file of [".env", ".env.local"]) {
  const path = join(ROOT, file);
  if (!existsSync(path)) continue;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, "");
  }
}

const HOST = process.env.FORPSI_FTP_HOST;
const USER = process.env.FORPSI_FTP_USER;
const PASSWORD = process.env.FORPSI_FTP_PASSWORD;
const REMOTE_DIR = process.env.FORPSI_FTP_DIR || "/www";
const LOCAL_DIR = join(ROOT, "out");

const [command = "check", ...flags] = process.argv.slice(2);
const wipe = flags.includes("--wipe");
const assumeYes = flags.includes("--yes");

if (!HOST || !USER || !PASSWORD) {
  console.error(
    "Chybí FTP údaje. Doplň do .env.local:\n" +
      "  FORPSI_FTP_HOST=\n  FORPSI_FTP_USER=\n  FORPSI_FTP_PASSWORD=\n  FORPSI_FTP_DIR=/www",
  );
  process.exit(1);
}

async function confirm(question) {
  if (assumeYes) return true;
  if (!process.stdin.isTTY) {
    console.error(`${question}\nNeinteraktivní běh — potvrď přidáním --yes.`);
    return false;
  }
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`${question} [ano/ne] `);
  rl.close();
  return /^a(no)?$|^y(es)?$/i.test(answer.trim());
}

async function connect() {
  const client = new Client(30_000);
  client.ftp.verbose = flags.includes("--verbose");
  try {
    await client.access({ host: HOST, user: USER, password: PASSWORD, secure: true });
    console.log("Připojeno přes FTPS (šifrovaně).");
  } catch (err) {
    console.warn(`FTPS selhalo (${err.message}) — zkouším nešifrované FTP.`);
    await client.access({ host: HOST, user: USER, password: PASSWORD, secure: false });
    console.log("Připojeno přes FTP.");
  }
  return client;
}

const client = await connect();

try {
  switch (command) {
    case "check": {
      console.log("\nKořen účtu:");
      for (const f of await client.list("/")) console.log(`  ${f.isDirectory ? "d" : "-"} ${f.name}`);
      console.log(`\n${REMOTE_DIR}:`);
      for (const f of await client.list(REMOTE_DIR)) console.log(`  ${f.isDirectory ? "d" : "-"} ${f.name}`);
      break;
    }

    case "backup": {
      const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, "-");
      const target = join(ROOT, "backups", `forpsi-${stamp}`);
      mkdirSync(target, { recursive: true });
      console.log(`Stahuji ${REMOTE_DIR} do ${target} …`);
      client.trackProgress((info) => {
        if (info.name) process.stdout.write(`\r  ${info.name.slice(-60).padEnd(60)}`);
      });
      await client.downloadToDir(target, REMOTE_DIR);
      client.trackProgress();
      console.log(`\nHotovo: ${target}`);
      break;
    }

    case "deploy": {
      if (!existsSync(join(LOCAL_DIR, "index.html"))) {
        console.error("Chybí out/index.html — spusť nejdřív `npm run build`.");
        process.exit(1);
      }
      if (wipe) {
        const ok = await confirm(
          `SMAZAT veškerý obsah ${REMOTE_DIR} na ${HOST} (včetně stávajícího WordPressu) a nahrát nový web?`,
        );
        if (!ok) {
          console.log("Zrušeno.");
          break;
        }
        await client.ensureDir(REMOTE_DIR);
        await client.cd(REMOTE_DIR);
        console.log(`Mažu obsah ${REMOTE_DIR} …`);
        await client.clearWorkingDir();
      }
      console.log(`Nahrávám out/ → ${REMOTE_DIR} …`);
      client.trackProgress((info) => {
        if (info.name) process.stdout.write(`\r  ${info.name.slice(-60).padEnd(60)}`);
      });
      await client.uploadFromDir(LOCAL_DIR, REMOTE_DIR);
      client.trackProgress();
      console.log("\nHotovo. Zkontroluj http://www.proplan-klima.cz/");
      break;
    }

    default:
      console.error(`Neznámý příkaz: ${command} (check | backup | deploy)`);
      process.exit(1);
  }
} finally {
  client.close();
}
