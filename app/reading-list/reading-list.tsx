"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpenIcon, TriangleAlertIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

export type SavedBook = {
  id: string;
  isbn13: string;
  title: string;
  authors: string | null;
  publisher: string | null;
  image_url: string | null;
};

type Props = {
  books: SavedBook[];
  loadFailed: boolean;
};

export function ReadingList({ books, loadFailed }: Props) {
  const router = useRouter();
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRemove(id: string) {
    setError(null);
    setRemoving(id);

    const supabase = createClient();
    const { error } = await supabase.from("reading_list").delete().eq("id", id);
    setRemoving(null);

    if (error) {
      setError("책을 빼지 못했습니다. 잠시 뒤에 다시 시도해 주세요.");
      return;
    }

    router.refresh();
  }

  if (loadFailed) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TriangleAlertIcon />
          </EmptyMedia>
          <EmptyTitle>목록을 불러오지 못했습니다</EmptyTitle>
          <EmptyDescription>
            잠시 뒤에 새로고침해 주세요.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (books.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <BookOpenIcon />
          </EmptyMedia>
          <EmptyTitle>아직 담아둔 책이 없습니다</EmptyTitle>
          <EmptyDescription>
            또래가 많이 읽은 책을 살펴보고 읽고 싶은 책을 담아 보세요.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <ItemGroup className="gap-3">
        {books.map((book) => (
          <Item key={book.id} variant="outline">
            <ItemMedia>
              {book.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={book.image_url}
                  alt=""
                  className="h-16 w-12 rounded object-cover"
                />
              ) : (
                <div className="flex h-16 w-12 items-center justify-center rounded bg-muted">
                  <BookOpenIcon className="text-muted-foreground" />
                </div>
              )}
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{book.title}</ItemTitle>
              <ItemDescription>
                {[book.authors, book.publisher].filter(Boolean).join(" · ")}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemove(book.id)}
                disabled={removing === book.id}
              >
                {removing === book.id ? "빼는 중" : "빼기"}
              </Button>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}
