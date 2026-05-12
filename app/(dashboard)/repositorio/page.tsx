import { createClient } from "@/lib/supabase/server";
import { RepositorioContent } from "./repositorio-content";

export default async function RepositorioPage() {
  const supabase = await createClient();

  const { data: archivos } = await supabase
    .from("archivos")
    .select("*")
    .eq("estado", "aprobado")
    .order("created_at", { ascending: false });

  return <RepositorioContent archivos={archivos || []} />;
}
