import { useMemo } from "react";
import format from "date-fns/format";
import {
  getDays,
  GetDaysProps,
  getWeekdayLabels,
  GetWeekdayLabelsProps,
} from "./useMonth.utils";

export const dayLabelFormatFn = (date: Date) => format(date, "dd");
export const weekdayLabelFormatFn = (date: Date) => format(date, "eeeeee");
export const monthLabelFormatFn = (date: Date) => format(date, "MMMM yyyy");

export interface UseMonthResultDays {
  dayLabel: string;
  date: Date;
  outsideMonth: boolean;
  type: string;
}

export interface UseMonthResult {
  weekdayLabels: string[];
  days: (number | UseMonthResultDays)[];
  monthLabel: string;
}

export interface UseMonthProps extends GetWeekdayLabelsProps, GetDaysProps {
  showOutsideMonth: boolean;
  monthLabelFormat?(date: Date): string;
}

export function useMonth({
  year,
  month,
  firstDayOfWeek = 1,
  showOutsideMonth,
  dayLabelFormat = dayLabelFormatFn,
  weekdayLabelFormat = weekdayLabelFormatFn,
  monthLabelFormat = monthLabelFormatFn,
}: UseMonthProps): UseMonthResult {
  const days = useMemo(
    () =>
      getDays({
        year,
        month,
        firstDayOfWeek,
        showOutsideMonth,
        dayLabelFormat,
      }),
    [year, month, firstDayOfWeek, showOutsideMonth, dayLabelFormat]
  );
  const weekdayLabels = useMemo(
    () => getWeekdayLabels({ firstDayOfWeek, weekdayLabelFormat }),
    [firstDayOfWeek, weekdayLabelFormat]
  );

  return {
    days,
    weekdayLabels,
    monthLabel: monthLabelFormat(new Date(year, month)),
  };
}
