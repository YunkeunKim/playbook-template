"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";
import { GRADES } from "@/lib/grade";
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
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!grade) {
      setError("학년을 골라 주세요.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { grade: Number(grade) } },
    });
    setPending(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/settings");
    router.refresh();
  }

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
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
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">비밀번호</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FieldDescription>여섯 자 이상으로 지어 주세요.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="grade">학년</FieldLabel>
                <Select
                  items={gradeItems}
                  value={grade}
                  onValueChange={(value) => setGrade(value as string | null)}
                >
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
              {error ? (
                <FieldDescription className="text-destructive">
                  {error}
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
