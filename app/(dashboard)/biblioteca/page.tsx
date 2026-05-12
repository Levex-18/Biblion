import { createClient } from "@/lib/supabase/server";
import { BibliotecaContent } from "./biblioteca-content";

export default async function BibliotecaPage() {
  const supabase = await createClient();

  const { data: libros } = await supabase
    .from("libros")
    .select("*")
    .eq("approved", true)
    .order("created_at", { ascending: false });

  return <BibliotecaContent libros={libros || []} />;
}
