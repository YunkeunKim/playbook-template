import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { formatReadDate } from "@/lib/reading";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { ReviewForm } from "./review-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ReviewPage({ params }: Props) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/login");
  }

  const { id } = await params;

  const { data: book } = await supabase
    .from("reading_list")
    .select("id, title, authors, publisher, read_on, review")
    .eq("id", id)
    .single();

  if (!book) {
    notFound();
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href="/read-books" />}
          nativeButton={false}
        >
          읽은 책으로
        </Button>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">
          {book.title}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {[book.authors, book.publisher].filter(Boolean).join(" · ")}
        </p>
        {book.read_on ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {formatReadDate(book.read_on)}에 읽었습니다.
          </p>
        ) : null}
        <div className="mt-8">
          <ReviewForm id={book.id} review={book.review ?? ""} />
        </div>
      </main>
    </>
  );
}
