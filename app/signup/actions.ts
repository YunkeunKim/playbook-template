"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { MAX_GRADE, MIN_GRADE } from "@/lib/grade";

export type SignUpState = { error: string | null };

export async function signUp(
  _prevState: SignUpState,
  formData: FormData
): Promise<SignUpState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const grade = Number(formData.get("grade"));

  if (!Number.isInteger(grade) || grade < MIN_GRADE || grade > MAX_GRADE) {
    return { error: "학년을 골라 주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { grade } },
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/reading-list");
}
