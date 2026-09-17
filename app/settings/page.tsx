import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";

export default async function SettingsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/login");
  }

  const userId = data.claims.sub as string;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, grade")
    .eq("id", userId)
    .single();

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <ProfileForm
        email={(data.claims.email as string | undefined) ?? ""}
        displayName={profile?.display_name ?? ""}
        grade={profile?.grade ?? null}
      />
    </div>
  );
}
