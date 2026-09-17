"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type Props = {
  from: string | null;
  to: string | null;
  today: string;
};

export function PeriodFilter({ from, to, today }: Props) {
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    const nextFrom = String(form.get("from") ?? "");
    const nextTo = String(form.get("to") ?? "");

    if (nextFrom) params.set("from", nextFrom);
    if (nextTo) params.set("to", nextTo);

    router.push(params.size > 0 ? `/read-books?${params}` : "/read-books");
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border p-4">
      <FieldGroup className="sm:flex-row sm:items-end">
        <Field>
          <FieldLabel htmlFor="from">시작일</FieldLabel>
          <Input
            id="from"
            name="from"
            type="date"
            max={today}
            defaultValue={from ?? ""}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="to">종료일</FieldLabel>
          <Input
            id="to"
            name="to"
            type="date"
            max={today}
            defaultValue={to ?? ""}
          />
        </Field>
        <div className="flex gap-2">
          <Button type="submit" size="sm">
            기간으로 보기
          </Button>
          {from || to ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => router.push("/read-books")}
            >
              전체 보기
            </Button>
          ) : null}
        </div>
      </FieldGroup>
    </form>
  );
}
