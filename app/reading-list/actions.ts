"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { seoulTodayIso, validateReadDate } from "@/lib/reading";
import { DEMO_BOOKS } from "@/lib/demo-books";

export type ReadingListState = { error: string | null };

// 또래 인기 도서 추천 화면이 생기기 전까지 쓰는 임시 수단이다.
// 그 화면이 붙으면 이 액션과 lib/demo-books.ts를 함께 지운다.
export async function addDemoBooks(
  // useActionState가 넘기는 값이라 쓰지 않아도 자리를 비울 수 없다.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prevState: ReadingListState
): Promise<ReadingListState> {
  const supabase = await createClient();

  const { data, error: authError } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub as string | undefined;
  if (authError || !userId) {
    return { error: "로그인이 풀렸습니다. 다시 로그인해 주세요." };
  }

  const { error } = await supabase.from("reading_list").upsert(
    DEMO_BOOKS.map((book) => ({ ...book, user_id: userId })),
    { onConflict: "user_id,isbn13", ignoreDuplicates: true }
  );

  if (error) {
    return { error: "담지 못했습니다. 잠시 뒤에 다시 시도해 주세요." };
  }

  revalidatePath("/reading-list");
  return { error: null };
}

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
