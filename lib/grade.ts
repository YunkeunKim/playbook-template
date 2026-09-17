export const GRADES = [
  { value: 4, label: "초등학교 4학년" },
  { value: 5, label: "초등학교 5학년" },
  { value: 6, label: "초등학교 6학년" },
  { value: 7, label: "중학교 1학년" },
  { value: 8, label: "중학교 2학년" },
  { value: 9, label: "중학교 3학년" },
  { value: 10, label: "고등학교 1학년" },
  { value: 11, label: "고등학교 2학년" },
  { value: 12, label: "고등학교 3학년" },
] as const;

export const MIN_GRADE = 4;
export const MAX_GRADE = 12;

export function gradeLabel(grade: number) {
  return GRADES.find((g) => g.value === grade)?.label ?? null;
}

export function gradeToAge(grade: number) {
  return grade + 6;
}
