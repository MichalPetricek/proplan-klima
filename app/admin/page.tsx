import type { Metadata } from "next";
import { AdminApp } from "@/components/admin/AdminApp";

export const metadata: Metadata = {
  title: "Administrace",
  description: "Správa obsahu webu Proplan Klima.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminApp />;
}
