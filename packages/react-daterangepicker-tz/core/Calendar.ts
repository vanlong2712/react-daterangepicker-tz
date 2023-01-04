import dayjs from "dayjs";
import { DaysInMonthArgs } from "./interface";

// The current year
export const THIS_YEAR: number = dayjs().year();
// (int) The current month starting from 1 - 12
// 1 => January, 12 => December
export const THIS_MONTH: number = dayjs().month() + 1;
// Week days names and shortnames
export const WEEK_DAYS = {
  Sunday: "Sun",
  Monday: "Mon",
  Tuesday: "Tue",
  Wednesday: "Wed",
  Thursday: "Thu",
  Friday: "Fri",
  Saturday: "Sat",
};
// Calendar months names and short names
export const CALENDAR_MONTHS = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};
// Weeks displayed on calendar
export const CALENDAR_WEEKS = 6;
// Pads a string value with leading zeroes(0) until length is reached
// For example: zeroPad(5, 2) => "05"
export const zeroPad = (value: number, length: number) => {
  return `${value}`.padStart(length, "0");
};

// (int) First day of the month for a given year from 1 - 7
// 1 => Sunday, 7 => Saturday
export function getMonthFirstDay(
  date: Required<DaysInMonthArgs> = { month: THIS_MONTH, year: THIS_YEAR }
): number {
  return +new Date(`${date.year}-${zeroPad(date.month, 2)}-01`).getDay() + 1;
}

// (int) Number days in a month for a given year from 28 - 31
export function getMonthDays(
  date: Required<DaysInMonthArgs> = { month: THIS_MONTH, year: THIS_YEAR }
): number {
  return dayjs(`${date.year}-${zeroPad(date.month, 2)}-01`).daysInMonth();
}

export function getDaysInMonth(date: Required<DaysInMonthArgs>): Array<number> {
  return Array.from({ length: getMonthDays(date) }, (_, i) => i + 1);
}

// ({month, year}) Gets the month and year before the given month and year
// For example: getPreviousMonth(1, 2000) => {month: 12, year: 1999}
// while: getPreviousMonth(12, 2000) => {month: 11, year: 2000}
export function getPreviousMonth(
  date: Required<DaysInMonthArgs>
): DaysInMonthArgs {
  const prevMonth = date.month > 1 ? date.month - 1 : 12;
  const prevMonthYear = date.month > 1 ? date.year : date.year - 1;
  return { month: prevMonth, year: prevMonthYear };
}
// ({month, year}) Gets the month and year after the given month and year
// For example: getNextMonth(1, 2000) => {month: 2, year: 2000}
// while: getNextMonth(12, 2000) => {month: 1, year: 2001}
export function getNextMonth(date: Required<DaysInMonthArgs>): DaysInMonthArgs {
  const nextMonth = date.month < 12 ? date.month + 1 : 1;
  const nextMonthYear = date.month < 12 ? date.year : date.year + 1;
  return { month: nextMonth, year: nextMonthYear };
}

export function getCalendarBuilder(
  date: Required<DaysInMonthArgs> = { month: THIS_MONTH, year: THIS_YEAR }
) {
  // Calendar builder for a month in the specified year
  // Returns an array of the calendar dates.
  // Each calendar date is represented as an array => [YYYY, MM, DD]
  // Get number of days in the month and the month's first day
  const monthDays = getMonthDays(date);
  const monthFirstDay = getMonthFirstDay(date);

  // Get number of days to be displayed from previous and next months
  // These ensure a total of 42 days (6 weeks) displayed on the calendar
  const daysFromPrevMonth = monthFirstDay - 1;
  const daysFromNextMonth =
    CALENDAR_WEEKS * 7 - (daysFromPrevMonth + monthDays);

  // Get the previous and next months and years
  const { month: prevMonth, year: prevMonthYear } = getPreviousMonth(date);
  const { month: nextMonth, year: nextMonthYear } = getNextMonth(date);
  // Get number of days in previous month
  const prevMonthDays = getMonthDays({ month: prevMonth, year: prevMonthYear });

  // Builds dates to be displayed from previous month
  const prevMonthDates = [...new Array(daysFromPrevMonth)].map((n, index) => {
    const day = index + 1 + (prevMonthDays - daysFromPrevMonth);
    return [prevMonthYear, zeroPad(prevMonth, 2), zeroPad(day, 2)];
  });

  // Builds dates to be displayed from current month
  const thisMonthDates = [...new Array(monthDays)].map((n, index) => {
    const day = index + 1;
    return [date.year, zeroPad(date.month, 2), zeroPad(day, 2)];
  });

  // Builds dates to be displayed from next month
  const nextMonthDates = [...new Array(daysFromNextMonth)].map((n, index) => {
    const day = index + 1;
    return [nextMonthYear, zeroPad(nextMonth, 2), zeroPad(day, 2)];
  });

  // Combines all dates from previous, current and next months
  return [...prevMonthDates, ...thisMonthDates, ...nextMonthDates];
}

// export function getDateRangeBuilder(
//   date: Required<DaysInMonthArgs> = { month: THIS_MONTH, year: THIS_YEAR }
// ) {
// // Builds dates to be displayed from next of next month - used for date range
// const { month: nextOfNextMonth, year: nextOfNextMonthYear } = getNextMonth({
//   month: nextMonth,
//   year: nextMonthYear,
// });
// const nextOfNextMonthDates = [...new Array(daysFromNextMonth)].map(
//   (n, index) => {
//     const day = index + 1;
//     return [
//       nextOfNextMonthYear,
//       zeroPad(nextOfNextMonth, 2),
//       zeroPad(day, 2),
//     ];
//   }
// );
// }
