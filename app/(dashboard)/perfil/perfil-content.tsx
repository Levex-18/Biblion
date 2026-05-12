"use client";

import {
  User,
  Mail,
  Shield,
  Calendar,
  FileText,
  Heart,
  BookOpen,
} from "lucide-react";
import type { Perfil } from "@/lib/types";

interface PerfilContentProps {
  perfil: Perfil;
  stats: {
    archivos: number;
    favoritos: number;
    articulosLeidos: number;
  };
}

export function PerfilContent({ perfil, stats }: PerfilContentProps) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <User className="h-7 w-7 text-primary" />
          Mi Perfil
        </h1>
        <p className="mt-1 text-muted-foreground">
          Informacion de tu cuenta y estadisticas
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {perfil.email?.split("@")[0] || "Usuario"}
            </h2>
            <span
              className={`inline-block mt-1 rounded px-2 py-0.5 text-xs font-medium capitalize ${
                perfil.rol === "admin"
                  ? "bg-destructive/10 text-destructive"
                  : perfil.rol === "moderador"
                    ? "bg-warning/10 text-warning"
                    : "bg-primary/10 text-primary"
              }`}
            >
              {perfil.rol}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Mail className="h-5 w-5" />
            <span>{perfil.email}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Shield className="h-5 w-5" />
            <span className="capitalize">Rol: {perfil.rol}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Calendar className="h-5 w-5" />
            <span>
              Miembro desde{" "}
              {new Date(perfil.created_at).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <div className="rounded-lg bg-primary/10 p-3 w-fit mx-auto mb-3">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <p className="text-3xl font-bold text-foreground">{stats.archivos}</p>
          <p className="text-sm text-muted-foreground">Archivos subidos</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <div className="rounded-lg bg-destructive/10 p-3 w-fit mx-auto mb-3">
            <Heart className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-3xl font-bold text-foreground">
            {stats.favoritos}
          </p>
          <p className="text-sm text-muted-foreground">Favoritos guardados</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <div className="rounded-lg bg-success/10 p-3 w-fit mx-auto mb-3">
            <BookOpen className="h-6 w-6 text-success" />
          </div>
          <p className="text-3xl font-bold text-foreground">
            {stats.articulosLeidos}
          </p>
          <p className="text-sm text-muted-foreground">Articulos leidos</p>
        </div>
      </div>
    </div>
  );
}
