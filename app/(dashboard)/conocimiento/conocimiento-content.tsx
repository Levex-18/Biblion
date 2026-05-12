"use client";

import { useState } from "react";
import {
  BookOpen,
  Filter,
  FileText,
  Tag,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { MATERIAS, CATEGORIAS_ARTICULO } from "@/lib/types";
import type {
  ArticuloConocimiento,
  Materia,
  CategoriaArticulo,
} from "@/lib/types";
import Link from "next/link";

interface ConocimientoContentProps {
  articulos: ArticuloConocimiento[];
}

export function ConocimientoContent({
  articulos: initialArticulos,
}: ConocimientoContentProps) {
  const [articulos] = useState<ArticuloConocimiento[]>(initialArticulos);
  const [filtroMateria, setFiltroMateria] = useState<Materia | "">("");
  const [filtroCategoria, setFiltroCategoria] = useState<
    CategoriaArticulo | ""
  >("");
  const [articulosLeidos] = useState<Set<string>>(new Set());

  const articulosFiltrados = articulos.filter((articulo) => {
    if (filtroMateria && articulo.materia !== filtroMateria) return false;
    if (filtroCategoria && articulo.categoria !== filtroCategoria) return false;
    return true;
  });

  const articulosPorMateria = MATERIAS.map((materia) => ({
    materia,
    articulos: articulosFiltrados.filter((a) => a.materia === materia),
    progreso:
      articulosFiltrados.filter(
        (a) => a.materia === materia && articulosLeidos.has(a.id)
      ).length /
      (articulosFiltrados.filter((a) => a.materia === materia).length || 1),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <BookOpen className="h-7 w-7 text-primary" />
          Base de Conocimiento
        </h1>
        <p className="mt-1 text-muted-foreground">
          Explora articulos educativos organizados por materia y categoria
        </p>
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
          value={filtroCategoria}
          onChange={(e) =>
            setFiltroCategoria(e.target.value as CategoriaArticulo | "")
          }
          className="rounded-lg border border-input bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          <option value="">Todas las categorias</option>
          {CATEGORIAS_ARTICULO.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Progress Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {articulosPorMateria.map(({ materia, articulos: arts, progreso }) => (
          <div
            key={materia}
            className="rounded-lg border border-border bg-card p-4"
          >
            <h3 className="font-medium text-foreground mb-2">{materia}</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-2 rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progreso * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {Math.round(progreso * 100)}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {arts.length} articulos
            </p>
          </div>
        ))}
      </div>

      {/* Articles List */}
      {articulosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground">
            No hay articulos disponibles
          </h3>
          <p className="mt-1 text-muted-foreground">
            Pronto habra nuevo contenido educativo
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {articulosFiltrados.map((articulo) => (
            <Link
              key={articulo.id}
              href={`/conocimiento/${articulo.id}`}
              className="group flex items-center justify-between rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/50"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`rounded-lg p-2 ${articulosLeidos.has(articulo.id) ? "bg-success/10" : "bg-primary/10"}`}
                >
                  {articulosLeidos.has(articulo.id) ? (
                    <CheckCircle className="h-6 w-6 text-success" />
                  ) : (
                    <FileText className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {articulo.titulo}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="inline-block rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      {articulo.materia}
                    </span>
                    <span className="inline-block rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                      {articulo.categoria}
                    </span>
                  </div>
                  {articulo.etiquetas.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {articulo.etiquetas.slice(0, 3).join(", ")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
