export type Rol = "usuario" | "moderador" | "admin";
export type Materia = "Programacion" | "Redes" | "SO" | "Matematica" | "Ingles";
export type TipoArchivo = "TP" | "resumen" | "parcial" | "guia";
export type EstadoArchivo = "pendiente" | "aprobado" | "rechazado";
export type CategoriaArticulo = "Conceptos" | "Tecnicas" | "Glosario";
export type GeneroLibro = "Novela" | "Ensayo" | "Poesia" | "Tecnico" | "Ciencia";
export type TipoFavorito = "archivo" | "articulo" | "libro";

export interface Perfil {
  id: string;
  email: string | null;
  rol: Rol;
  created_at: string;
}

export interface Archivo {
  id: string;
  titulo: string;
  materia: Materia;
  anio: number;
  tipo: TipoArchivo;
  url_archivo: string;
  estado: EstadoArchivo;
  user_id: string;
  created_at: string;
}

export interface ArticuloConocimiento {
  id: string;
  titulo: string;
  materia: Materia;
  categoria: CategoriaArticulo;
  contenido: string;
  etiquetas: string[];
  created_at: string;
  updated_at: string;
}

export interface Libro {
  id: string;
  titulo: string;
  autor: string;
  genero: GeneroLibro;
  enlace_externo: string | null;
  approved: boolean;
  created_at: string;
}

export interface Favorito {
  id: string;
  user_id: string;
  item_type: TipoFavorito;
  item_id: string;
  created_at: string;
}

export interface Notificacion {
  id: string;
  user_id: string;
  mensaje: string;
  leida: boolean;
  tipo: string;
  created_at: string;
}

export interface ProgresoLectura {
  id: string;
  user_id: string;
  articulo_id: string;
  created_at: string;
}

// Constants
export const MATERIAS: Materia[] = [
  "Programacion",
  "Redes",
  "SO",
  "Matematica",
  "Ingles",
];

export const TIPOS_ARCHIVO: TipoArchivo[] = ["TP", "resumen", "parcial", "guia"];

export const CATEGORIAS_ARTICULO: CategoriaArticulo[] = [
  "Conceptos",
  "Tecnicas",
  "Glosario",
];

export const GENEROS_LIBRO: GeneroLibro[] = [
  "Novela",
  "Ensayo",
  "Poesia",
  "Tecnico",
  "Ciencia",
];

export const ANIOS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
