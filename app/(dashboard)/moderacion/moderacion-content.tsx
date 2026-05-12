"use client";

import { useState } from "react";
import {
  Shield,
  FileText,
  Check,
  X,
  ExternalLink,
  Tag,
  Calendar,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Archivo, Perfil } from "@/lib/types";

interface ModeracionContentProps {
  perfil: Perfil;
  archivosPendientes: Archivo[];
}

export function ModeracionContent({
  perfil,
  archivosPendientes: initialArchivos,
}: ModeracionContentProps) {
  const [archivos, setArchivos] = useState<Archivo[]>(initialArchivos);
  const [processing, setProcessing] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleApprove = async (archivoId: string) => {
    setProcessing(archivoId);
    await supabase
      .from("archivos")
      .update({ estado: "aprobado" })
      .eq("id", archivoId);
    setArchivos((prev) => prev.filter((a) => a.id !== archivoId));
    setProcessing(null);
    router.refresh();
  };

  const handleReject = async (archivoId: string) => {
    setProcessing(archivoId);
    await supabase
      .from("archivos")
      .update({ estado: "rechazado" })
      .eq("id", archivoId);
    setArchivos((prev) => prev.filter((a) => a.id !== archivoId));
    setProcessing(null);
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Shield className="h-7 w-7 text-primary" />
          Panel de Moderacion
        </h1>
        <p className="mt-1 text-muted-foreground">
          Revisa y aprueba los archivos subidos por los usuarios
        </p>
      </div>

      <div className="rounded-lg bg-card border border-border p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Conectado como:{" "}
            <span className="font-medium text-foreground">{perfil.email}</span>
          </span>
          <span
            className={`rounded px-2 py-0.5 text-xs font-medium capitalize ${
              perfil.rol === "admin"
                ? "bg-destructive/10 text-destructive"
                : "bg-warning/10 text-warning"
            }`}
          >
            {perfil.rol}
          </span>
        </div>
      </div>

      <div className="rounded-lg bg-card border border-border p-6">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Archivos Pendientes ({archivos.length})
        </h2>

        {archivos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Check className="h-12 w-12 text-success mb-4" />
            <h3 className="text-lg font-medium text-foreground">
              No hay archivos pendientes
            </h3>
            <p className="mt-1 text-muted-foreground">
              Todos los archivos han sido revisados
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {archivos.map((archivo) => (
              <div
                key={archivo.id}
                className="rounded-lg border border-border bg-secondary/30 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-2">
                      {archivo.titulo}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        <span>{archivo.materia}</span>
                      </div>
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs">
                        {archivo.tipo}
                      </span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{archivo.anio}</span>
                      </div>
                    </div>
                    <a
                      href={archivo.url_archivo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Ver archivo
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(archivo.id)}
                      disabled={processing === archivo.id}
                      className="flex items-center gap-2 rounded-lg bg-success px-4 py-2 text-sm font-medium text-success-foreground transition-colors hover:bg-success/90 disabled:opacity-50"
                    >
                      {processing === archivo.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleReject(archivo.id)}
                      disabled={processing === archivo.id}
                      className="flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:opacity-50"
                    >
                      {processing === archivo.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                      Rechazar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
