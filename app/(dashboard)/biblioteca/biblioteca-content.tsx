"use client";

import { useState } from "react";
import {
  Library,
  Filter,
  BookOpen,
  ExternalLink,
  Heart,
  User,
  Tag,
} from "lucide-react";
import { GENEROS_LIBRO } from "@/lib/types";
import type { Libro, GeneroLibro } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface BibliotecaContentProps {
  libros: Libro[];
}

export function BibliotecaContent({
  libros: initialLibros,
}: BibliotecaContentProps) {
  const [libros] = useState<Libro[]>(initialLibros);
  const [filtroGenero, setFiltroGenero] = useState<GeneroLibro | "">("");
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());
  const supabase = createClient();

  const librosFiltrados = libros.filter((libro) => {
    if (filtroGenero && libro.genero !== filtroGenero) return false;
    return true;
  });

  const toggleFavorito = async (libroId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (favoritos.has(libroId)) {
      await supabase
        .from("favoritos")
        .delete()
        .eq("user_id", user.id)
        .eq("item_type", "libro")
        .eq("item_id", libroId);
      setFavoritos((prev) => {
        const newSet = new Set(prev);
        newSet.delete(libroId);
        return newSet;
      });
    } else {
      await supabase.from("favoritos").insert({
        user_id: user.id,
        item_type: "libro",
        item_id: libroId,
      });
      setFavoritos((prev) => new Set(prev).add(libroId));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Library className="h-7 w-7 text-primary" />
          Biblioteca Digital
        </h1>
        <p className="mt-1 text-muted-foreground">
          Descubre libros recomendados para tu desarrollo academico
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 rounded-lg bg-card p-4 border border-border">
        <Filter className="h-5 w-5 text-muted-foreground" />
        <select
          value={filtroGenero}
          onChange={(e) => setFiltroGenero(e.target.value as GeneroLibro | "")}
          className="rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          <option value="">Todos los generos</option>
          {GENEROS_LIBRO.map((genero) => (
            <option key={genero} value={genero}>
              {genero}
            </option>
          ))}
        </select>
      </div>

      {/* Books Grid */}
      {librosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-12 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground">
            No hay libros disponibles
          </h3>
          <p className="mt-1 text-muted-foreground">
            Pronto habra nuevos libros en la biblioteca
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {librosFiltrados.map((libro) => (
            <div
              key={libro.id}
              className="group rounded-lg border border-border bg-card overflow-hidden transition-colors hover:border-primary/50"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <BookOpen className="h-16 w-16 text-primary/40" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-foreground line-clamp-2 flex-1">
                    {libro.titulo}
                  </h3>
                  <button
                    onClick={() => toggleFavorito(libro.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors ml-2"
                  >
                    <Heart
                      className={`h-5 w-5 ${favoritos.has(libro.id) ? "fill-destructive text-destructive" : ""}`}
                    />
                  </button>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="line-clamp-1">{libro.autor}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <span>{libro.genero}</span>
                  </div>
                </div>

                {libro.enlace_externo && (
                  <a
                    href={libro.enlace_externo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Leer libro
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
