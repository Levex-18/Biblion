import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MainLayout } from "@/components/main-layout";
import type { Perfil } from "@/lib/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  let { data: perfil } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Si no existe el perfil, crearlo
  if (!perfil) {
    const { data: newPerfil } = await supabase
      .from("perfiles")
      .insert({
        id: user.id,
        email: user.email,
        rol: "usuario",
      })
      .select()
      .single();
    perfil = newPerfil;
  }

  // Fallback si aun no hay perfil
  const perfilData: Perfil | null = perfil || {
    id: user.id,
    email: user.email || "",
    rol: "usuario",
    created_at: new Date().toISOString(),
  };

  return <MainLayout perfil={perfilData}>{children}</MainLayout>;
}
