import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ArticuloDetail } from "./articulo-detail";

export default async function ArticuloPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: articulo } = await supabase
    .from("conocimiento_articulos")
    .select("*")
    .eq("id", id)
    .single();

  if (!articulo) {
    notFound();
  }

  return <ArticuloDetail articulo={articulo} />;
}
