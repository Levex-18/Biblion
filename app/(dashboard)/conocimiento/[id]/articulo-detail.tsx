"use client";

import { useState } from "react";
import { ArrowLeft, Tag, Calendar, Heart, CheckCircle } from "lucide-react";
import Link from "next/link";
import type { ArticuloConocimiento } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import ReactMarkdown from "react-markdown";

interface ArticuloDetailProps {
  articulo: ArticuloConocimiento;
}

export function ArticuloDetail({ articulo }: ArticuloDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRead, setIsRead] = useState(false);
  const supabase = createClient();

  const toggleFavorite = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (isFavorite) {
      await supabase
        .from("favoritos")
        .delete()
        .eq("user_id", user.id)
        .eq("item_type", "articulo")
        .eq("item_id", articulo.id);
    } else {
      await supabase.from("favoritos").insert({
        user_id: user.id,
        item_type: "articulo",
        item_id: articulo.id,
      });
    }
    setIsFavorite(!isFavorite);
  };

  const markAsRead = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (!isRead) {
      await supabase.from("progreso_lectura").insert({
        user_id: user.id,
        articulo_id: articulo.id,
      });
      setIsRead(true);
    }
  };

  return (
    <div className="max-w-4xl">
      <Link
        href="/conocimiento"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a la base de conocimiento
      </Link>

      <article className="rounded-lg border border-border bg-card p-8">
        <header className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-3">
                {articulo.titulo}
              </h1>
              <div className="flex items-center gap-3">
                <span className="inline-block rounded bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {articulo.materia}
                </span>
                <span className="inline-block rounded bg-secondary px-3 py-1 text-sm text-muted-foreground">
                  {articulo.categoria}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-lg transition-colors ${isFavorite ? "bg-destructive/10 text-destructive" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
              >
                <Heart
                  className={`h-5 w-5 ${isFavorite ? "fill-destructive" : ""}`}
                />
              </button>
              <button
                onClick={markAsRead}
                disabled={isRead}
                className={`p-2 rounded-lg transition-colors ${isRead ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
              >
                <CheckCircle
                  className={`h-5 w-5 ${isRead ? "fill-success" : ""}`}
                />
              </button>
            </div>
          </div>

          {articulo.etiquetas.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="h-4 w-4 text-muted-foreground" />
              {articulo.etiquetas.map((etiqueta) => (
                <span
                  key={etiqueta}
                  className="rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground"
                >
                  {etiqueta}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Actualizado el{" "}
              {new Date(articulo.updated_at).toLocaleDateString("es-ES")}
            </span>
          </div>
        </header>

        <div className="prose prose-invert max-w-none">
          <ReactMarkdown>{articulo.contenido}</ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
