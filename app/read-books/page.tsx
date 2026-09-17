import Link from "next/link";
import { redirect } from "next/navigation";
import { PrinterIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { seoulTodayIso } from "@/lib/reading";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { PeriodFilter } from "./period-filter";
import { ReadBooks, type ReadBook } from "./read-books";

type Props = {
  searchParams: Promise<{ from?: string; to?: string }>;
};

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export default async function ReadBooksPage({ searchParams }: Props) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/login");
  }

  const params = await searchParams;
  const from = params.from && ISO_DATE.test(params.from) ? params.from : null;
  const to = params.to && ISO_DATE.test(params.to) ? params.to : null;

  let query = supabase
    .from("reading_list")
    .select("id, title, authors, publisher, image_url, read_on, review")
    .not("read_on", "is", null);

  if (from) query = query.gte("read_on", from);
  if (to) query = query.lte("read_on", to);

  const { data: books, error: loadError } = await query.order("read_on", {
    ascending: false,
  });

  const printHref = (() => {
    const q = new URLSearchParams();
    if (from) q.set("from", from);
    if (to) q.set("to", to);
    return q.size > 0 ? `/read-books/print?${q}` : "/read-books/print";
  })();

  return (
    <>
      <AppHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">읽은 책</h1>
            <p className="mt-1 text-muted-foreground">
              지금까지 읽고 기록해 둔 책입니다.
            </p>
          </div>
          {books && books.length > 0 ? (
            <Button
              variant="outline"
              size="sm"
              render={<Link href={printHref} />}
              nativeButton={false}
            >
              <PrinterIcon data-icon="inline-start" />
              출력
            </Button>
          ) : null}
        </div>
        <div className="mt-8 flex flex-col gap-6">
          {/* 기간이 바뀌면 입력칸을 새로 만든다. 값만 갈면 기본값이 반영되지 않는다. */}
          <PeriodFilter
            key={`${from ?? ""}-${to ?? ""}`}
            from={from}
            to={to}
            today={seoulTodayIso()}
          />
          <ReadBooks
            books={(books as ReadBook[]) ?? []}
            loadFailed={Boolean(loadError)}
            filtered={Boolean(from || to)}
          />
        </div>
      </main>
    </>
  );
}
