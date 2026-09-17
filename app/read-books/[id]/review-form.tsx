"use client";

import { useActionState } from "react";

import { deleteRecord, markAsUnread, saveReview } from "../actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  id: string;
  review: string;
};

export function ReviewForm({ id, review }: Props) {
  const [state, formAction, pending] = useActionState(saveReview, {
    error: null,
    savedAt: null,
  });
  const [unreadState, unreadAction, unreadPending] = useActionState(
    markAsUnread,
    { error: null, savedAt: null }
  );
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteRecord,
    { error: null, savedAt: null }
  );

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <form action={formAction}>
          <input type="hidden" name="id" value={id} />
          <CardHeader>
            <CardTitle>독후감</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="review" className="sr-only">
                  독후감
                </FieldLabel>
                <Textarea
                  id="review"
                  name="review"
                  rows={12}
                  defaultValue={review}
                  placeholder="어떤 책이었는지, 무엇이 남았는지 편하게 적어 보세요."
                />
                <FieldDescription>
                  길이는 정해져 있지 않습니다. 언제든 다시 고칠 수 있습니다.
                </FieldDescription>
              </Field>
              {state.error ? (
                <FieldDescription className="text-destructive">
                  {state.error}
                </FieldDescription>
              ) : null}
              {state.savedAt ? (
                <FieldDescription>저장했습니다.</FieldDescription>
              ) : null}
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "저장하는 중" : "저장"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="flex flex-wrap gap-2">
        <form action={unreadAction}>
          <input type="hidden" name="id" value={id} />
          <Button type="submit" variant="outline" size="sm" disabled={unreadPending}>
            아직 안 읽었어요
          </Button>
        </form>
        <form action={deleteAction}>
          <input type="hidden" name="id" value={id} />
          <Button type="submit" variant="ghost" size="sm" disabled={deletePending}>
            기록 지우기
          </Button>
        </form>
      </div>
      {unreadState.error || deleteState.error ? (
        <p className="text-sm text-destructive">
          {unreadState.error ?? deleteState.error}
        </p>
      ) : null}
      <p className="text-sm text-muted-foreground">
        「아직 안 읽었어요」를 누르면 읽을 책 목록으로 돌아가고, 쓴 독후감은
        그대로 남습니다. 「기록 지우기」는 독후감까지 함께 지웁니다.
      </p>
    </div>
  );
}
