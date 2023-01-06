export const zeroPad = (value: number | string, length: number) => {
  return `${value}`.padStart(length, "0");
};

export const convertTime12to24 = (time12h: string): string => {
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes, seconds] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier === "PM") {
    hours = `${parseInt(hours, 10) + 12}`;
  }

  return [hours, minutes, seconds || "00"].filter((el) => !!el).join(":");
};
