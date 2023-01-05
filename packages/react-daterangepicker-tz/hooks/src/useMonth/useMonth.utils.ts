import add from "date-fns/add";
import addDays from "date-fns/addDays";
import eachDay from "date-fns/eachDayOfInterval";
import endOfMonth from "date-fns/endOfMonth";
import endOfWeek from "date-fns/endOfWeek";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import startOfMonth from "date-fns/startOfMonth";
import startOfWeek from "date-fns/startOfWeek";
import sub from "date-fns/sub";
import { UseMonthResultDays } from "./useMonth";

type FirstDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export interface GetWeekdayLabelsProps {
  firstDayOfWeek?: FirstDayOfWeek;
  weekdayLabelFormat?(date: Date): string;
}

export function getWeekdayLabels({
  firstDayOfWeek = 1,
  weekdayLabelFormat = (date: Date) => format(date, "iiiiii"),
}: GetWeekdayLabelsProps = {}) {
  const now = new Date();
  const arr = eachDay({
    start: addDays(startOfWeek(now), firstDayOfWeek),
    end: addDays(endOfWeek(now), firstDayOfWeek),
  });
  return arr.reduce((array, date) => {
    // @ts-ignore
    array.push(weekdayLabelFormat(date));
    return array;
  }, []);
}

export interface GetDaysProps {
  year: number;
  month: number;
  firstDayOfWeek?: FirstDayOfWeek;
  showOutsideMonth: boolean;
  dayLabelFormat?(date: Date): string;
}

export type CalendarDay = number | { dayLabel: string; date: Date };
export function getDays({
  year,
  month,
  firstDayOfWeek = 1,
  showOutsideMonth,
  dayLabelFormat = (date: Date) => format(date, "dd"),
}: GetDaysProps): CalendarDay[] {
  const date = new Date(year, month);
  const previousMonthDate = sub(date, { months: 1 });
  const nextMonthDate = add(date, { months: 1 });

  const monthStart = startOfMonth(date);
  const monthStartDay = getDay(monthStart);
  const monthEnd = endOfMonth(date);

  const previousMonthEnd = endOfMonth(previousMonthDate);
  const nextMonthStart = startOfMonth(nextMonthDate);

  let prevMonthDays = [];

  if (showOutsideMonth) {
    const prevMonthDaysLength = Array.from(
      Array(
        monthStartDay >= firstDayOfWeek
          ? monthStartDay - firstDayOfWeek
          : 6 - firstDayOfWeek + monthStartDay + 1
      ).keys()
    ).length;
    prevMonthDays = eachDay({
      start: sub(previousMonthEnd, {
        days: Math.max(0, prevMonthDaysLength - 1),
      }),
      end: previousMonthEnd,
    }).map((date) => ({
      date,
      dayLabel: dayLabelFormat(date),
      outsideMonth: true,
      type: "previous",
    }));
  } else {
    prevMonthDays = Array.from(
      Array(
        monthStartDay >= firstDayOfWeek
          ? monthStartDay - firstDayOfWeek
          : 6 - firstDayOfWeek + monthStartDay + 1
      ).keys()
    ).fill(0);
  }

  const days = eachDay({ start: monthStart, end: monthEnd }).map((date) => ({
    date,
    dayLabel: dayLabelFormat(date),
  }));

  let nextMonthDays: UseMonthResultDays[] = [];

  if (showOutsideMonth) {
    const totalDaysShowInMonth = 6 * 7;
    const nextMonthDaysLength = Array.from(
      Array(totalDaysShowInMonth - prevMonthDays.length - days.length).keys()
    ).length;
    nextMonthDays = eachDay({
      start: nextMonthStart,
      end: add(nextMonthStart, {
        days: Math.max(0, nextMonthDaysLength - 1),
      }),
    }).map((date) => ({
      date,
      dayLabel: dayLabelFormat(date),
      outsideMonth: true,
      type: "next",
    }));
  }

  return [...prevMonthDays, ...days, ...nextMonthDays];
}
