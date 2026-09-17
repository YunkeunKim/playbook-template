const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const SEOUL_OFFSET_MS = 9 * 60 * 60 * 1000;

// 배포 서버는 UTC로 도는데 학생은 한국에 있다. 기준을 맞추지 않으면
// 한국 시간으로 오늘인 날짜가 서버에서 미래로 판정된다.
export function seoulTodayIso(now: Date = new Date()): string {
  return new Date(now.getTime() + SEOUL_OFFSET_MS).toISOString().slice(0, 10);
}

export function validateReadDate(
  input: string,
  todayIso: string
): string | null {
  if (!input) {
    return "읽은 날짜를 골라 주세요.";
  }

  if (!ISO_DATE.test(input)) {
    return "날짜 형식이 올바르지 않습니다.";
  }

  const parsed = new Date(`${input}T00:00:00Z`);
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== input
  ) {
    return "날짜 형식이 올바르지 않습니다.";
  }

  if (input > todayIso) {
    return "아직 오지 않은 날짜는 고를 수 없습니다.";
  }

  return null;
}

export function formatReadDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}
