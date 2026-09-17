"use client";

import { useActionState } from "react";
import Link from "next/link";

import { login } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, { error: null });

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <form action={formAction}>
          <CardHeader>
            <CardTitle>로그인</CardTitle>
            <CardDescription>책길에 다시 오신 걸 환영합니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">이메일</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">비밀번호</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </Field>
              {state.error ? (
                <FieldDescription className="text-destructive">
                  {state.error}
                </FieldDescription>
              ) : null}
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex-col items-stretch gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? "로그인하는 중" : "로그인"}
            </Button>
            <FieldDescription className="text-center">
              처음이신가요? <Link href="/signup">가입하기</Link>
            </FieldDescription>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
