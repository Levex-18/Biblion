import { createClient } from "@/lib/supabase/server";
import { FavoritosContent } from "./favoritos-content";

export default async function FavoritosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: favoritos } = await supabase
    .from("favoritos")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <FavoritosContent favoritos={favoritos || []} />;
}
