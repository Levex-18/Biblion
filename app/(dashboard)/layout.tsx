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

  const { data: perfil } = await supabase
    .from("perfiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return <MainLayout perfil={perfil as Perfil | null}>{children}</MainLayout>;
}
