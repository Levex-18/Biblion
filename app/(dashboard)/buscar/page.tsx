"use client";

import { useState } from "react";
import {
  Search,
  FileText,
  BookOpen,
  Library,
  Loader2,
  Tag,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import type { Archivo, ArticuloConocimiento, Libro } from "@/lib/types";

type SearchResult = {
  type: "archivo" | "articulo" | "libro";
  id: string;
  titulo: string;
  subtitulo: string;
  tags: string[];
};

export default function BuscarPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const supabase = createClient();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);

    const searchResults: SearchResult[] = [];

    // Search archivos
    const { data: archivos } = await supabase
      .from("archivos")
      .select("*")
      .eq("estado", "aprobado")
      .ilike("titulo", `%${query}%`);

    if (archivos) {
      archivos.forEach((archivo: Archivo) => {
        searchResults.push({
          type: "archivo",
          id: archivo.id,
          titulo: archivo.titulo,
          subtitulo: `${archivo.materia} - ${archivo.tipo}`,
          tags: [archivo.materia, archivo.tipo, String(archivo.anio)],
        });
      });
    }

    // Search articulos
    const { data: articulos } = await supabase
      .from("conocimiento_articulos")
      .select("*")
      .ilike("titulo", `%${query}%`);

    if (articulos) {
      articulos.forEach((articulo: ArticuloConocimiento) => {
        searchResults.push({
          type: "articulo",
          id: articulo.id,
          titulo: articulo.titulo,
          subtitulo: `${articulo.materia} - ${articulo.categoria}`,
          tags: [articulo.materia, articulo.categoria, ...articulo.etiquetas],
        });
      });
    }

    // Search libros
    const { data: libros } = await supabase
      .from("libros")
      .select("*")
      .eq("approved", true)
      .or(`titulo.ilike.%${query}%,autor.ilike.%${query}%`);

    if (libros) {
      libros.forEach((libro: Libro) => {
        searchResults.push({
          type: "libro",
          id: libro.id,
          titulo: libro.titulo,
          subtitulo: libro.autor,
          tags: [libro.genero],
        });
      });
    }

    setResults(searchResults);
    setLoading(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "archivo":
        return <FileText className="h-5 w-5" />;
      case "articulo":
        return <BookOpen className="h-5 w-5" />;
      case "libro":
        return <Library className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getLink = (result: SearchResult) => {
    switch (result.type) {
      case "archivo":
        return "/repositorio";
      case "articulo":
        return `/conocimiento/${result.id}`;
      case "libro":
        return "/biblioteca";
      default:
        return "#";
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Search className="h-7 w-7 text-primary" />
          Buscar
        </h1>
        <p className="mt-1 text-muted-foreground">
          Encuentra archivos, articulos y libros en toda la plataforma
        </p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Buscar por titulo, autor, materia..."
            className="w-full rounded-lg border border-input bg-card pl-10 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 className="h-5 w-5 animate-spin" />}
          Buscar
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : hasSearched && results.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground">
            No se encontraron resultados
          </h3>
          <p className="mt-1 text-muted-foreground">
            Intenta con otros terminos de busqueda
          </p>
        </div>
      ) : (
        results.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {results.length} resultado{results.length !== 1 && "s"} encontrado
              {results.length !== 1 && "s"}
            </p>
            {results.map((result) => (
              <Link
                key={`${result.type}-${result.id}`}
                href={getLink(result)}
                className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
              >
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  {getIcon(result.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">
                    {result.titulo}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {result.subtitulo}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    <div className="flex gap-1 flex-wrap">
                      {result.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="rounded bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground capitalize">
                  {result.type}
                </span>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
}
