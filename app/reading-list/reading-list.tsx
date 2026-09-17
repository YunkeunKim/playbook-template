"use client";

import { useActionState } from "react";
import { BookOpenIcon, TriangleAlertIcon } from "lucide-react";

import { seoulTodayIso } from "@/lib/reading";
import { markAsRead, removeFromList } from "./actions";
import { BookCover } from "@/components/book-cover";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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

function MarkAsReadDialog({ book }: { book: SavedBook }) {
  const [state, formAction, pending] = useActionState(markAsRead, {
    error: null,
  });
  const today = seoulTodayIso();

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        읽었어요
      </DialogTrigger>
      <DialogContent>
        <form action={formAction}>
          <input type="hidden" name="id" value={book.id} />
          <DialogHeader>
            <DialogTitle>읽은 날짜</DialogTitle>
            <DialogDescription>{book.title}</DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor={`readOn-${book.id}`}>언제 읽었나요?</FieldLabel>
              <Input
                id={`readOn-${book.id}`}
                name="readOn"
                type="date"
                defaultValue={today}
                max={today}
                required
              />
              <FieldDescription>
                예전에 읽은 책이면 그때 날짜로 바꿔 주세요.
              </FieldDescription>
            </Field>
            {state.error ? (
              <FieldDescription className="text-destructive">
                {state.error}
              </FieldDescription>
            ) : null}
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "기록하는 중" : "기록하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function RemoveButton({ id }: { id: string }) {
  const [state, formAction, pending] = useActionState(removeFromList, {
    error: null,
  });

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={id} />
      <Button type="submit" variant="ghost" size="sm" disabled={pending}>
        {pending ? "빼는 중" : "빼기"}
      </Button>
      {state.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
    </form>
  );
}

export function ReadingList({ books, loadFailed }: Props) {
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
          <EmptyTitle>아직 담아둔 책이 없습니다</EmptyTitle>
          <EmptyDescription>
            또래가 많이 읽은 책을 살펴보고 읽고 싶은 책을 담아 보세요.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
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
          </ItemContent>
          <ItemActions>
            <MarkAsReadDialog book={book} />
            <RemoveButton id={book.id} />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  );
}
