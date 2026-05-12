"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  FileText,
  BookOpen,
  Library,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import type { Favorito } from "@/lib/types";

interface FavoritoItem extends Favorito {
  titulo?: string;
  subtitulo?: string;
}

interface FavoritosContentProps {
  favoritos: Favorito[];
}

export function FavoritosContent({
  favoritos: initialFavoritos,
}: FavoritosContentProps) {
  const [favoritos, setFavoritos] = useState<FavoritoItem[]>(initialFavoritos);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const loadFavoritosDetails = async () => {
      const enrichedFavoritos: FavoritoItem[] = [];

      for (const fav of initialFavoritos) {
        let titulo = "";
        let subtitulo = "";

        if (fav.item_type === "archivo") {
          const { data } = await supabase
            .from("archivos")
            .select("titulo, materia, tipo")
            .eq("id", fav.item_id)
            .single();
          if (data) {
            titulo = data.titulo;
            subtitulo = `${data.materia} - ${data.tipo}`;
          }
        } else if (fav.item_type === "articulo") {
          const { data } = await supabase
            .from("conocimiento_articulos")
            .select("titulo, materia, categoria")
            .eq("id", fav.item_id)
            .single();
          if (data) {
            titulo = data.titulo;
            subtitulo = `${data.materia} - ${data.categoria}`;
          }
        } else if (fav.item_type === "libro") {
          const { data } = await supabase
            .from("libros")
            .select("titulo, autor, genero")
            .eq("id", fav.item_id)
            .single();
          if (data) {
            titulo = data.titulo;
            subtitulo = `${data.autor} - ${data.genero}`;
          }
        }

        enrichedFavoritos.push({
          ...fav,
          titulo,
          subtitulo,
        });
      }

      setFavoritos(enrichedFavoritos);
      setLoading(false);
    };

    loadFavoritosDetails();
  }, [initialFavoritos, supabase]);

  const removeFavorito = async (favoritoId: string) => {
    await supabase.from("favoritos").delete().eq("id", favoritoId);
    setFavoritos((prev) => prev.filter((f) => f.id !== favoritoId));
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

  const getLink = (fav: FavoritoItem) => {
    switch (fav.item_type) {
      case "archivo":
        return "/repositorio";
      case "articulo":
        return `/conocimiento/${fav.item_id}`;
      case "libro":
        return "/biblioteca";
      default:
        return "#";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Heart className="h-7 w-7 text-primary" />
          Mis Favoritos
        </h1>
        <p className="mt-1 text-muted-foreground">
          Accede rapidamente a los recursos que guardaste
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-lg bg-card border border-border"
            />
          ))}
        </div>
      ) : favoritos.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-12 text-center">
          <Heart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground">
            No tienes favoritos
          </h3>
          <p className="mt-1 text-muted-foreground">
            Guarda archivos, articulos y libros para acceder rapidamente
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favoritos.map((fav) => (
            <div
              key={fav.id}
              className="rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  {getIcon(fav.item_type)}
                </div>
                <button
                  onClick={() => removeFavorito(fav.id)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="font-medium text-foreground line-clamp-2 mb-1">
                {fav.titulo || "Cargando..."}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                {fav.subtitulo}
              </p>
              <Link
                href={getLink(fav)}
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                Ver recurso
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
