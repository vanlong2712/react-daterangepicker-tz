export const zeroPad = (value: number | string, length: number) => {
  return `${value}`.padStart(length, "0");
};
