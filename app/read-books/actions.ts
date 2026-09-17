"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type ReadBookState = { error: string | null; savedAt: number | null };

export async function saveReview(
  _prevState: ReadBookState,
  formData: FormData
): Promise<ReadBookState> {
  const id = String(formData.get("id") ?? "");
  const review = String(formData.get("review") ?? "");

  const supabase = await createClient();
  const { error } = await supabase
    .from("reading_list")
    .update({
      review: review.trim() === "" ? null : review,
      review_updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return {
      error: "저장하지 못했습니다. 쓰신 내용은 그대로 두었으니 다시 시도해 주세요.",
      savedAt: null,
    };
  }

  revalidatePath("/read-books");
  revalidatePath(`/read-books/${id}`);
  return { error: null, savedAt: Date.now() };
}

export async function markAsUnread(
  _prevState: ReadBookState,
  formData: FormData
): Promise<ReadBookState> {
  const id = String(formData.get("id") ?? "");

  const supabase = await createClient();
  const { error } = await supabase
    .from("reading_list")
    .update({ read_on: null })
    .eq("id", id);

  if (error) {
    return {
      error: "되돌리지 못했습니다. 잠시 뒤에 다시 시도해 주세요.",
      savedAt: null,
    };
  }

  revalidatePath("/read-books");
  revalidatePath("/reading-list");
  redirect("/reading-list");
}

export async function deleteRecord(
  _prevState: ReadBookState,
  formData: FormData
): Promise<ReadBookState> {
  const id = String(formData.get("id") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.from("reading_list").delete().eq("id", id);

  if (error) {
    return {
      error: "지우지 못했습니다. 잠시 뒤에 다시 시도해 주세요.",
      savedAt: null,
    };
  }

  revalidatePath("/read-books");
  redirect("/read-books");
}
