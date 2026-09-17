import { describe, expect, test } from "vitest";

import { seoulTodayIso, validateReadDate } from "./reading";

describe("validateReadDate", () => {
  const today = "2026-09-17";

  test("오늘 읽었다고 기록할 수 있다", () => {
    expect(validateReadDate("2026-09-17", today)).toBeNull();
  });

  test("지난 날짜로 기록할 수 있다", () => {
    expect(validateReadDate("2024-03-02", today)).toBeNull();
  });

  test("아직 오지 않은 날짜는 기록할 수 없다", () => {
    expect(validateReadDate("2026-09-18", today)).not.toBeNull();
  });

  test("날짜를 고르지 않으면 기록할 수 없다", () => {
    expect(validateReadDate("", today)).not.toBeNull();
  });

  test("날짜 형식이 아니면 기록할 수 없다", () => {
    expect(validateReadDate("어제", today)).not.toBeNull();
    expect(validateReadDate("2026-13-01", today)).not.toBeNull();
  });
});

describe("seoulTodayIso", () => {
  test("서버가 UTC로 돌아도 서울 기준 날짜를 돌려준다", () => {
    // 서울은 9월 18일 오전 8시인데 UTC로는 아직 9월 17일이다.
    expect(seoulTodayIso(new Date("2026-09-17T23:00:00Z"))).toBe("2026-09-18");
  });

  test("서울 기준 자정 직후도 그날로 센다", () => {
    expect(seoulTodayIso(new Date("2026-09-17T15:00:00Z"))).toBe("2026-09-18");
  });

  test("서울 기준 자정 직전은 전날이다", () => {
    expect(seoulTodayIso(new Date("2026-09-17T14:59:00Z"))).toBe("2026-09-17");
  });
});
