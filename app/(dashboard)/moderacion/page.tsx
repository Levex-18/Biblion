import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ModeracionContent } from "./moderacion-content";
import type { Perfil } from "@/lib/types";

export default async function ModeracionPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!perfil || (perfil.rol !== "moderador" && perfil.rol !== "admin")) {
    redirect("/repositorio");
  }

  // Get pending files
  const { data: archivosPendientes } = await supabase
    .from("archivos")
    .select("*")
    .eq("estado", "pendiente")
    .order("created_at", { ascending: false });

  return (
    <ModeracionContent
      perfil={perfil as Perfil}
      archivosPendientes={archivosPendientes || []}
    />
  );
}
