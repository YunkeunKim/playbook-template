"use client";

import { useActionState } from "react";
import Link from "next/link";

import { GRADES } from "@/lib/grade";
import { signUp } from "./actions";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const gradeItems = [
  { label: "학년을 골라 주세요", value: null },
  ...GRADES.map((g) => ({ label: g.label, value: String(g.value) })),
];

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUp, { error: null });

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <form action={formAction}>
          <CardHeader>
            <CardTitle>책길 시작하기</CardTitle>
            <CardDescription>
              학년을 알려주면 또래가 많이 읽은 책을 찾아 드립니다.
            </CardDescription>
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
                  autoComplete="new-password"
                  required
                  minLength={6}
                />
                <FieldDescription>여섯 자 이상으로 지어 주세요.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="grade">학년</FieldLabel>
                <Select items={gradeItems} name="grade">
                  <SelectTrigger id="grade">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {gradeItems.map((item) => (
                        <SelectItem key={String(item.value)} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
              {pending ? "가입하는 중" : "가입하기"}
            </Button>
            <FieldDescription className="text-center">
              이미 계정이 있나요? <Link href="/login">로그인</Link>
            </FieldDescription>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
