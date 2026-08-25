#!/usr/bin/env node
// Správa administrátorů webu bez klikání v dashboardu.
//
//   node scripts/supabase-admin.mjs check            – stav databáze a bucketu
//   node scripts/supabase-admin.mjs list             – seznam administrátorů
//   node scripts/supabase-admin.mjs create <e-mail> [heslo]
//   node scripts/supabase-admin.mjs revoke <e-mail>  – odebere práva správce
//
// Skript používá SUPABASE_SECRET_KEY z .env.local. Ten klíč obchází RLS,
// proto se nikdy nesmí dostat do prohlížeče ani do gitu.

import { readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

function loadEnv(file) {
  let raw;
  try {
    raw = readFileSync(new URL(`../${file}`, import.meta.url), "utf8");
  } catch {
    return;
  }
  for (const line of raw.split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const value = match[2].replace(/^["']|["']$/g, "");
    if (value && !process.env[match[1]]) process.env[match[1]] = value;
  }
}

loadEnv(".env.local");
loadEnv(".env");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;

if (!url || !secret) {
  console.error(
    "Chybí NEXT_PUBLIC_SUPABASE_URL (.env) nebo SUPABASE_SECRET_KEY (.env.local).",
  );
  process.exit(1);
}

const headers = {
  apikey: secret,
  Authorization: `Bearer ${secret}`,
  "Content-Type": "application/json",
};

async function api(path, init = {}) {
  const response = await fetch(`${url}${path}`, {
    ...init,
    headers: { ...headers, ...init.headers },
  });
  const text = await response.text();
  let body = text;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    /* ponecháme jako text */
  }
  return { ok: response.ok, status: response.status, body };
}

async function findUser(email) {
  const target = email.toLowerCase();
  for (let page = 1; page <= 20; page += 1) {
    const { ok, body } = await api(
      `/auth/v1/admin/users?page=${page}&per_page=200`,
    );
    if (!ok) return null;
    const users = body?.users ?? [];
    const hit = users.find((user) => user.email?.toLowerCase() === target);
    if (hit) return hit;
    if (users.length < 200) return null;
  }
  return null;
}

function generatePassword() {
  // Bez znaků, které se dají snadno zaměnit při diktování po telefonu.
  const alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(20);
  return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
}

async function check() {
  const tables = [
    "site_contacts",
    "references",
    "contact_submissions",
    "admin_users",
  ];
  let missing = 0;

  for (const table of tables) {
    const { ok, status, body } = await api(
      `/rest/v1/${table}?select=*&limit=1`,
      { headers: { Prefer: "count=exact" } },
    );
    if (ok) {
      console.log(`  ✓ ${table} – ${Array.isArray(body) ? body.length : 0} řádek v ukázce`);
    } else {
      missing += 1;
      const detail = body?.message ?? status;
      console.log(`  ✗ ${table} – ${detail}`);
    }
  }

  const bucket = await api("/storage/v1/bucket/reference-images");
  if (bucket.ok) {
    console.log(
      `  ✓ bucket reference-images – ${bucket.body.public ? "veřejný" : "PRIVÁTNÍ (má být veřejný)"}`,
    );
  } else {
    missing += 1;
    console.log("  ✗ bucket reference-images chybí");
  }

  if (missing) {
    console.log(
      "\nSpusťte supabase/migrations/20260821000100_initial_cms.sql v SQL editoru:",
    );
    console.log(`  ${dashboardSqlUrl()}`);
    process.exitCode = 1;
    return;
  }

  // Kontroly výše běží se secret key, který RLS obchází. Web ale chodí přes
  // publishable key, takže ověříme i to, co reálně uvidí návštěvník.
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!publishable) {
    console.log("\nNEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY chybí v .env – veřejné čtení neověřeno.");
    process.exitCode = 1;
    return;
  }

  console.log("\nVeřejný přístup (publishable key, přes RLS):");
  const anonHeaders = { apikey: publishable, Authorization: `Bearer ${publishable}` };
  let anonFailed = 0;

  for (const [table, label] of [
    ["site_contacts?select=company_name", "kontakty"],
    ["references?select=title&published=eq.true", "publikované reference"],
  ]) {
    const response = await fetch(`${url}/rest/v1/${table}`, { headers: anonHeaders });
    const rows = response.ok ? await response.json() : null;
    if (response.ok) {
      console.log(`  ✓ ${label} – ${rows.length} záznamů čitelných`);
    } else {
      anonFailed += 1;
      console.log(`  ✗ ${label} – HTTP ${response.status}`);
    }
  }

  // Anonym nesmí vidět evidenci poptávek. Samotné HTTP 200 ještě únik
  // neznamená – RLS vrací prázdné pole. Průkazné je až srovnání s tím,
  // co ve stejné tabulce vidí secret key.
  const [anonRows, adminRows] = await Promise.all([
    api("/rest/v1/contact_submissions?select=id", { headers: anonHeaders }),
    api("/rest/v1/contact_submissions?select=id"),
  ]);
  const anonCount = Array.isArray(anonRows.body) ? anonRows.body.length : 0;
  const adminCount = Array.isArray(adminRows.body) ? adminRows.body.length : 0;

  if (anonCount > 0) {
    anonFailed += 1;
    console.log(`  ✗ poptávky jsou veřejně čitelné (${anonCount}) – zkontrolujte RLS!`);
  } else if (adminCount === 0) {
    console.log("  · poptávky: zatím žádné, skrytí se ověří s první poptávkou");
  } else {
    console.log(`  ✓ poptávky skryté – správce vidí ${adminCount}, veřejnost 0`);
  }

  if (anonFailed) process.exitCode = 1;
  else console.log("\nDatabáze je připravená.");
}

function dashboardSqlUrl() {
  const ref = new URL(url).hostname.split(".")[0];
  return `https://supabase.com/dashboard/project/${ref}/sql/new`;
}

async function list() {
  const admins = await api("/rest/v1/admin_users?select=user_id,created_at");
  if (!admins.ok) {
    console.error("Nepodařilo se načíst admin_users:", admins.body);
    process.exit(1);
  }
  if (!admins.body.length) {
    console.log("Zatím není nastavený žádný administrátor.");
    return;
  }
  for (const admin of admins.body) {
    const user = await api(`/auth/v1/admin/users/${admin.user_id}`);
    const email = user.ok ? user.body.email : "(uživatel smazán)";
    console.log(`  • ${email} – od ${admin.created_at.slice(0, 10)}`);
  }
}

async function create(email, passwordArg) {
  if (!email) {
    console.error("Použití: node scripts/supabase-admin.mjs create <e-mail> [heslo]");
    process.exit(1);
  }

  const password = passwordArg || generatePassword();
  let user = await findUser(email);
  let created = false;

  if (user) {
    console.log(`Uživatel ${email} už v Auth existuje.`);
    if (passwordArg) {
      const update = await api(`/auth/v1/admin/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify({ password }),
      });
      if (!update.ok) {
        console.error("Heslo se nepodařilo změnit:", update.body);
        process.exit(1);
      }
      console.log("Heslo bylo přenastaveno.");
    }
  } else {
    const result = await api("/auth/v1/admin/users", {
      method: "POST",
      body: JSON.stringify({ email, password, email_confirm: true }),
    });
    if (!result.ok) {
      console.error("Uživatele se nepodařilo vytvořit:", result.body);
      process.exit(1);
    }
    user = result.body;
    created = true;
  }

  const grant = await api("/rest/v1/admin_users", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=representation" },
    body: JSON.stringify({ user_id: user.id }),
  });
  if (!grant.ok) {
    console.error("Zápis do admin_users selhal:", grant.body);
    console.error("Proběhla už migrace? Zkuste: node scripts/supabase-admin.mjs check");
    process.exit(1);
  }

  console.log(`\nAdministrátor je připravený pro přihlášení na /admin:`);
  console.log(`  e-mail: ${email}`);
  if (created || passwordArg) console.log(`  heslo:  ${password}`);
  else console.log("  heslo:  beze změny (stávající účet)");
  console.log("\nHeslo si po prvním přihlášení změňte v Supabase → Authentication.");
}

async function revoke(email) {
  if (!email) {
    console.error("Použití: node scripts/supabase-admin.mjs revoke <e-mail>");
    process.exit(1);
  }
  const user = await findUser(email);
  if (!user) {
    console.error(`Uživatel ${email} v Auth neexistuje.`);
    process.exit(1);
  }
  const result = await api(`/rest/v1/admin_users?user_id=eq.${user.id}`, {
    method: "DELETE",
  });
  if (!result.ok) {
    console.error("Odebrání se nepodařilo:", result.body);
    process.exit(1);
  }
  console.log(`${email} už není správce. Účet v Auth zůstal zachovaný.`);
}

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case "check":
    await check();
    break;
  case "list":
    await list();
    break;
  case "create":
    await create(args[0], args[1]);
    break;
  case "revoke":
    await revoke(args[0]);
    break;
  default:
    console.log(
      [
        "Správa Supabase administrace:",
        "  node scripts/supabase-admin.mjs check",
        "  node scripts/supabase-admin.mjs list",
        "  node scripts/supabase-admin.mjs create <e-mail> [heslo]",
        "  node scripts/supabase-admin.mjs revoke <e-mail>",
      ].join("\n"),
    );
    process.exit(command ? 1 : 0);
}
