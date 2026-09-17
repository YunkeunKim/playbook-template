import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";
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
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">내 정보</h1>
        <p className="mt-1 text-muted-foreground">
          이름과 학년을 바꿀 수 있습니다.
        </p>
        <div className="mt-8">
          <ProfileForm
            email={(data.claims.email as string | undefined) ?? ""}
            displayName={profile?.display_name ?? ""}
            grade={profile?.grade ?? null}
          />
        </div>
      </main>
    </>
  );
}
