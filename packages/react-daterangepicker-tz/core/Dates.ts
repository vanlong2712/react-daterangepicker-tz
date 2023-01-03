import dayjs from "dayjs";

export function getDaysInMonth(month: number, year: number): Array<number> {
  const daysInMonth = dayjs([year, month, "01"].join("-")).daysInMonth();
  return Array.from({ length: daysInMonth }, (_, i) => i + 1);
}
