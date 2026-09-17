"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

type Props = {
  email: string;
  displayName: string;
  grade: number | null;
};

export function ProfileForm({ email, displayName, grade }: Props) {
  const router = useRouter();
  const [name, setName] = useState(displayName);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(
    grade === null ? null : String(grade)
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!selectedGrade) {
      setError("학년을 골라 주세요.");
      return;
    }

    setPending(true);
    const supabase = createClient();
    const { data: claims } = await supabase.auth.getClaims();
    const userId = claims?.claims?.sub as string | undefined;

    if (!userId) {
      setPending(false);
      setError("로그인이 풀렸습니다. 다시 로그인해 주세요.");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: name, grade: Number(selectedGrade) })
      .eq("id", userId);
    setPending(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage("저장했습니다.");
    router.refresh();
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>계정</CardTitle>
          <CardDescription>{email}</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="display-name">이름</FieldLabel>
              <Input
                id="display-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <FieldDescription>책길에서 불릴 이름입니다.</FieldDescription>
            </Field>
            <Field>
              <FieldLabel htmlFor="grade">학년</FieldLabel>
              <Select
                items={gradeItems}
                value={selectedGrade}
                onValueChange={(value) =>
                  setSelectedGrade(value as string | null)
                }
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
            {message ? <FieldDescription>{message}</FieldDescription> : null}
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex-col items-stretch gap-3">
          <Button type="submit" disabled={pending}>
            {pending ? "저장하는 중" : "저장"}
          </Button>
          <Button type="button" variant="outline" onClick={handleSignOut}>
            로그아웃
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
