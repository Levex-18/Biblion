"use client";

import { Sidebar } from "./sidebar";
import type { Perfil } from "@/lib/types";

interface MainLayoutProps {
  children: React.ReactNode;
  perfil: Perfil | null;
}

export function MainLayout({ children, perfil }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar perfil={perfil} />
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </div>
  );
}
