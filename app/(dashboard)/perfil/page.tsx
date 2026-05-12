import { createClient } from "@/lib/supabase/server";
import { PerfilContent } from "./perfil-content";
import type { Perfil } from "@/lib/types";

export default async function PerfilPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get user stats
  const { count: archivosCount } = await supabase
    .from("archivos")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: favoritosCount } = await supabase
    .from("favoritos")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { count: progresoCount } = await supabase
    .from("progreso_lectura")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  return (
    <PerfilContent
      perfil={perfil as Perfil}
      stats={{
        archivos: archivosCount || 0,
        favoritos: favoritosCount || 0,
        articulosLeidos: progresoCount || 0,
      }}
    />
  );
}
