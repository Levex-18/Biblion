"use client";

import { useState } from "react";
import { X, Loader2, Upload, Link as LinkIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { MATERIAS, TIPOS_ARCHIVO, ANIOS } from "@/lib/types";
import type { Materia, TipoArchivo } from "@/lib/types";

interface UploadFileModalProps {
  onClose: () => void;
}

export function UploadFileModal({ onClose }: UploadFileModalProps) {
  const [titulo, setTitulo] = useState("");
  const [materia, setMateria] = useState<Materia>("Programacion");
  const [tipo, setTipo] = useState<TipoArchivo>("TP");
  const [anio, setAnio] = useState(2024);
  const [urlArchivo, setUrlArchivo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Debes iniciar sesion para subir archivos");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("archivos").insert({
      titulo,
      materia,
      tipo,
      anio,
      url_archivo: urlArchivo,
      user_id: user.id,
      estado: "pendiente",
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      router.refresh();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-card border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Subir archivo
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Titulo
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full rounded-lg border border-input bg-secondary px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              placeholder="Nombre del archivo"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Materia
              </label>
              <select
                value={materia}
                onChange={(e) => setMateria(e.target.value as Materia)}
                className="w-full rounded-lg border border-input bg-secondary px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
              >
                {MATERIAS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tipo
              </label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoArchivo)}
                className="w-full rounded-lg border border-input bg-secondary px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
              >
                {TIPOS_ARCHIVO.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Ano
            </label>
            <select
              value={anio}
              onChange={(e) => setAnio(Number(e.target.value))}
              className="w-full rounded-lg border border-input bg-secondary px-4 py-2.5 text-foreground focus:border-primary focus:outline-none"
            >
              {ANIOS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              URL del archivo
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="url"
                value={urlArchivo}
                onChange={(e) => setUrlArchivo(e.target.value)}
                required
                className="w-full rounded-lg border border-input bg-secondary pl-10 pr-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                placeholder="https://drive.google.com/..."
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Sube tu archivo a Google Drive y pega el enlace aqui
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border px-4 py-2.5 font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Subiendo..." : "Subir"}
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Tu archivo sera revisado por un moderador antes de ser publicado
          </p>
        </form>
      </div>
    </div>
  );
}
