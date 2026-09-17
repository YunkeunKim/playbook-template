import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { AppHeader } from "@/components/app-header";
import { ReadingList, type SavedBook } from "./reading-list";

export default async function ReadingListPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/login");
  }

  const { data: books, error: loadError } = await supabase
    .from("reading_list")
    .select("id, isbn13, title, authors, publisher, image_url")
    .order("added_at", { ascending: false });

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">읽을 책</h1>
        <p className="mt-1 text-muted-foreground">
          읽고 싶어서 담아둔 책입니다.
        </p>
        <div className="mt-8">
          <ReadingList
            books={(books as SavedBook[]) ?? []}
            loadFailed={Boolean(loadError)}
          />
        </div>
      </main>
    </>
  );
}
