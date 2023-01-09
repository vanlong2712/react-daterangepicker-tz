import dayjs from "dayjs";
import { TimeProps } from "../components/DateRangePicker";

export const zeroPad = (value: number | string, length: number) => {
  return `${value}`.padStart(length, "0");
};

export const convertTime12to24 = (time12h: TimeProps): TimeProps => {
  let { hours, minutes, seconds, ampm } = time12h;
  if (hours === 12) {
    hours = 0;
  }

  if (ampm === "PM") {
    hours = hours + 12;
  }

  return { hours, minutes, seconds, ampm };
};

export const formatDateString = ({
  date,
  format,
}: {
  date: Date | null;
  format: string;
}): string => {
  if (date) {
    return dayjs(date).format(format);
  }
  return "";
};
