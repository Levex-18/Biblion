"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderOpen,
  BookOpen,
  Library,
  Search,
  Heart,
  User,
  Shield,
  LogOut,
  BookMarked,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Perfil } from "@/lib/types";

interface SidebarProps {
  perfil: Perfil | null;
}

const navItems = [
  { href: "/repositorio", label: "Repositorio", icon: FolderOpen },
  { href: "/conocimiento", label: "Base de Conocimiento", icon: BookOpen },
  { href: "/biblioteca", label: "Biblioteca", icon: Library },
  { href: "/buscar", label: "Buscar", icon: Search },
  { href: "/favoritos", label: "Favoritos", icon: Heart },
  { href: "/perfil", label: "Mi Perfil", icon: User },
];

export function Sidebar({ perfil }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const isModerator = perfil?.rol === "moderador" || perfil?.rol === "admin";

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <BookMarked className="h-8 w-8 text-primary" />
        <span className="text-xl font-bold text-foreground">Biblion</span>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}

        {isModerator && (
          <Link
            href="/moderacion"
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
              pathname.startsWith("/moderacion")
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Shield className="h-5 w-5" />
            Moderacion
          </Link>
        )}
      </nav>

      <div className="border-t border-border p-4">
        {perfil && (
          <div className="mb-3 rounded-lg bg-secondary px-3 py-2">
            <p className="text-sm font-medium text-foreground truncate">
              {perfil.email}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {perfil.rol}
            </p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          Cerrar sesion
        </button>
      </div>
    </aside>
  );
}
