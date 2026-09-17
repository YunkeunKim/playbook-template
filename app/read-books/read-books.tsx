"use client";

import Link from "next/link";
import { BookOpenIcon, TriangleAlertIcon } from "lucide-react";

import { formatReadDate } from "@/lib/reading";
import { BookCover } from "@/components/book-cover";
import { Badge } from "@/components/ui/badge";
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

export type ReadBook = {
  id: string;
  title: string;
  authors: string | null;
  publisher: string | null;
  image_url: string | null;
  read_on: string;
  review: string | null;
};

type Props = {
  books: ReadBook[];
  loadFailed: boolean;
  filtered: boolean;
};

export function ReadBooks({ books, loadFailed, filtered }: Props) {
  if (loadFailed) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <TriangleAlertIcon />
          </EmptyMedia>
          <EmptyTitle>목록을 불러오지 못했습니다</EmptyTitle>
          <EmptyDescription>잠시 뒤에 새로고침해 주세요.</EmptyDescription>
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
          <EmptyTitle>
            {filtered
              ? "이 기간에 읽은 책이 없습니다"
              : "아직 읽은 책이 없습니다"}
          </EmptyTitle>
          <EmptyDescription>
            {filtered
              ? "기간을 바꾸거나 전체 보기로 돌아가 보세요."
              : "읽을 책 목록에서 다 읽은 책을 기록해 보세요."}
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">모두 {books.length}권</p>
      <ItemGroup className="gap-3">
        {books.map((book) => (
          <Item key={book.id} variant="outline">
            <ItemMedia>
              <BookCover url={book.image_url} />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{book.title}</ItemTitle>
              <ItemDescription>
                {[book.authors, book.publisher].filter(Boolean).join(" · ")}
              </ItemDescription>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-sm text-muted-foreground">
                  {formatReadDate(book.read_on)}
                </span>
                {book.review ? (
                  <Badge variant="secondary">독후감 씀</Badge>
                ) : (
                  <Badge variant="outline">독후감 아직</Badge>
                )}
              </div>
            </ItemContent>
            <ItemActions>
              <Button
                variant="outline"
                size="sm"
                render={<Link href={`/read-books/${book.id}`} />}
                nativeButton={false}
              >
                {book.review ? "독후감 보기" : "독후감 쓰기"}
              </Button>
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
}
