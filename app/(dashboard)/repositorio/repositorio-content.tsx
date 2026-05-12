"use client";

import { useState } from "react";
import {
  FolderOpen,
  Upload,
  Filter,
  FileText,
  Download,
  Heart,
  Calendar,
  Tag,
} from "lucide-react";
import { MATERIAS, TIPOS_ARCHIVO, ANIOS } from "@/lib/types";
import type { Archivo, Materia, TipoArchivo } from "@/lib/types";
import { UploadFileModal } from "./upload-file-modal";
import { createClient } from "@/lib/supabase/client";

interface RepositorioContentProps {
  archivos: Archivo[];
}

export function RepositorioContent({
  archivos: initialArchivos,
}: RepositorioContentProps) {
  const [archivos] = useState<Archivo[]>(initialArchivos);
  const [filtroMateria, setFiltroMateria] = useState<Materia | "">("");
  const [filtroTipo, setFiltroTipo] = useState<TipoArchivo | "">("");
  const [filtroAnio, setFiltroAnio] = useState<number | "">("");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());
  const supabase = createClient();

  const archivosFiltrados = archivos.filter((archivo) => {
    if (filtroMateria && archivo.materia !== filtroMateria) return false;
    if (filtroTipo && archivo.tipo !== filtroTipo) return false;
    if (filtroAnio && archivo.anio !== filtroAnio) return false;
    return true;
  });

  const toggleFavorito = async (archivoId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (favoritos.has(archivoId)) {
      await supabase
        .from("favoritos")
        .delete()
        .eq("user_id", user.id)
        .eq("item_type", "archivo")
        .eq("item_id", archivoId);
      setFavoritos((prev) => {
        const newSet = new Set(prev);
        newSet.delete(archivoId);
        return newSet;
      });
    } else {
      await supabase.from("favoritos").insert({
        user_id: user.id,
        item_type: "archivo",
        item_id: archivoId,
      });
      setFavoritos((prev) => new Set(prev).add(archivoId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <FolderOpen className="h-7 w-7 text-primary" />
            Repositorio de Archivos
          </h1>
          <p className="mt-1 text-muted-foreground">
            Accede a trabajos practicos, resumenes, parciales y guias de estudio
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Upload className="h-5 w-5" />
          Subir archivo
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg bg-card p-4 border border-border">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <select
          value={filtroMateria}
          onChange={(e) => setFiltroMateria(e.target.value as Materia | "")}
          className="rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          <option value="">Todas las materias</option>
          {MATERIAS.map((materia) => (
            <option key={materia} value={materia}>
              {materia}
            </option>
          ))}
        </select>
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value as TipoArchivo | "")}
          className="rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          <option value="">Todos los tipos</option>
          {TIPOS_ARCHIVO.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
        <select
          value={filtroAnio}
          onChange={(e) =>
            setFiltroAnio(e.target.value ? Number(e.target.value) : "")
          }
          className="rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          <option value="">Todos los anos</option>
          {ANIOS.map((anio) => (
            <option key={anio} value={anio}>
              {anio}
            </option>
          ))}
        </select>
      </div>

      {/* Files Grid */}
      {archivosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground">
            No hay archivos disponibles
          </h3>
          <p className="mt-1 text-muted-foreground">
            Se el primero en subir un archivo para esta categoria
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {archivosFiltrados.map((archivo) => (
            <div
              key={archivo.id}
              className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground line-clamp-1">
                      {archivo.titulo}
                    </h3>
                    <span className="inline-block mt-1 rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      {archivo.tipo}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleFavorito(archivo.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Heart
                    className={`h-5 w-5 ${favoritos.has(archivo.id) ? "fill-destructive text-destructive" : ""}`}
                  />
                </button>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>{archivo.materia}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{archivo.anio}</span>
                </div>
              </div>

              <a
                href={archivo.url_archivo}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
              >
                <Download className="h-4 w-4" />
                Descargar
              </a>
            </div>
          ))}
        </div>
      )}

      {showUploadModal && (
        <UploadFileModal onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
}
