import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { formatReadDate } from "@/lib/reading";
import { gradeLabel } from "@/lib/grade";
import { Button } from "@/components/ui/button";
import { PrintButton } from "./print-button";

type Props = {
  searchParams: Promise<{ from?: string; to?: string }>;
};

type PrintBook = {
  id: string;
  title: string;
  authors: string | null;
  publisher: string | null;
  read_on: string;
  review: string | null;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export default async function PrintPage({ searchParams }: Props) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/login");
  }

  const userId = data.claims.sub as string;
  const params = await searchParams;
  const from = params.from && ISO_DATE.test(params.from) ? params.from : null;
  const to = params.to && ISO_DATE.test(params.to) ? params.to : null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, grade")
    .eq("id", userId)
    .single();

  let query = supabase
    .from("reading_list")
    .select("id, title, authors, publisher, read_on, review")
    .not("read_on", "is", null);

  if (from) query = query.gte("read_on", from);
  if (to) query = query.lte("read_on", to);

  const { data: rows } = await query.order("read_on", { ascending: true });
  const books = (rows as PrintBook[]) ?? [];

  const backHref = (() => {
    const q = new URLSearchParams();
    if (from) q.set("from", from);
    if (to) q.set("to", to);
    return q.size > 0 ? `/read-books?${q}` : "/read-books";
  })();

  const period =
    from && to
      ? `${formatReadDate(from)} ~ ${formatReadDate(to)}`
      : from
        ? `${formatReadDate(from)}부터`
        : to
          ? `${formatReadDate(to)}까지`
          : "전체 기간";

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10 print:max-w-none print:py-6">
      <div className="flex items-center justify-between gap-4 print:hidden">
        <Button
          variant="ghost"
          size="sm"
          render={<Link href={backHref} />}
          nativeButton={false}
        >
          읽은 책으로
        </Button>
        <PrintButton />
      </div>

      <article className="mt-8 print:mt-0">
        <header className="border-b pb-4">
          <h1 className="text-2xl font-semibold tracking-tight">독서 기록</h1>
          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted-foreground">
            {profile?.display_name ? (
              <div className="flex gap-2">
                <dt>이름</dt>
                <dd className="text-foreground">{profile.display_name}</dd>
              </div>
            ) : null}
            {profile?.grade ? (
              <div className="flex gap-2">
                <dt>학년</dt>
                <dd className="text-foreground">
                  {gradeLabel(profile.grade)}
                </dd>
              </div>
            ) : null}
            <div className="flex gap-2">
              <dt>기간</dt>
              <dd className="text-foreground">{period}</dd>
            </div>
            <div className="flex gap-2">
              <dt>권수</dt>
              <dd className="text-foreground">{books.length}권</dd>
            </div>
          </dl>
        </header>

        {books.length === 0 ? (
          <p className="py-10 text-muted-foreground">
            이 기간에 읽은 책이 없습니다.
          </p>
        ) : (
          <ol className="divide-y">
            {books.map((book, index) => (
              <li key={book.id} className="break-inside-avoid py-5">
                <div className="flex gap-3">
                  <span className="text-muted-foreground">{index + 1}</span>
                  <div className="flex-1">
                    <h2 className="font-medium">{book.title}</h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {[book.authors, book.publisher].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {formatReadDate(book.read_on)}에 읽음
                    </p>
                    {book.review ? (
                      <p className="mt-3 text-sm leading-7 whitespace-pre-wrap">
                        {book.review}
                      </p>
                    ) : (
                      <p className="mt-3 text-sm text-muted-foreground">
                        독후감을 아직 쓰지 않았습니다.
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </article>
    </main>
  );
}
