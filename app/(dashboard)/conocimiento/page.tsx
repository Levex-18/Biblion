import { createClient } from "@/lib/supabase/server";
import { ConocimientoContent } from "./conocimiento-content";

export default async function ConocimientoPage() {
  const supabase = await createClient();

  const { data: articulos } = await supabase
    .from("conocimiento_articulos")
    .select("*")
    .order("created_at", { ascending: false });

  return <ConocimientoContent articulos={articulos || []} />;
}
