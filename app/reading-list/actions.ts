"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { seoulTodayIso, validateReadDate } from "@/lib/reading";

export type ReadingListState = { error: string | null };

export async function markAsRead(
  _prevState: ReadingListState,
  formData: FormData
): Promise<ReadingListState> {
  const id = String(formData.get("id") ?? "");
  const readOn = String(formData.get("readOn") ?? "");

  const dateError = validateReadDate(readOn, seoulTodayIso());
  if (dateError) {
    return { error: dateError };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("reading_list")
    .update({ read_on: readOn })
    .eq("id", id);

  if (error) {
    return { error: "기록하지 못했습니다. 잠시 뒤에 다시 시도해 주세요." };
  }

  revalidatePath("/reading-list");
  revalidatePath("/read-books");
  return { error: null };
}

export async function removeFromList(
  _prevState: ReadingListState,
  formData: FormData
): Promise<ReadingListState> {
  const id = String(formData.get("id") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.from("reading_list").delete().eq("id", id);

  if (error) {
    return { error: "책을 빼지 못했습니다. 잠시 뒤에 다시 시도해 주세요." };
  }

  revalidatePath("/reading-list");
  return { error: null };
}
