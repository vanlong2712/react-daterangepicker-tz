import { TimeProps } from "../../../components/DateRangePicker";
import { convertTime12to24 } from "../../../utils/utils";

interface UseTimeProps {
  date?: Date | null;
}

export function getTimeFromDate(date?: Date | null): TimeProps {
  const hours = date?.getHours();
  let hour = hours ? hours % 12 : 1;
  hour = hour ? hour : 12;
  return {
    hours: hour,
    minutes: date?.getMinutes() || 0,
    seconds: date?.getSeconds() || 0,
    ampm: typeof hours !== "undefined" ? (hours >= 12 ? "PM" : "AM") : "AM",
  };
}

function useTime({ date }: UseTimeProps) {
  return getTimeFromDate(date);
}

export function setTimeToDate({
  date,
  time,
}: {
  date?: Date | null;
  time: TimeProps;
}): void {
  if (date) {
    const time24h = convertTime12to24(time);
    date.setHours(time24h.hours);
    date.setMinutes(time24h.minutes);
    date.setSeconds(time24h.seconds);
    date.setMilliseconds(0);
  }
}

export default useTime;
