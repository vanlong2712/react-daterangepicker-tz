interface UseTimeProps {
  date?: Date | null;
}

function useTime({ date }: UseTimeProps) {
  const hours = date?.getHours();
  let hour = hours ? hours % 12 : 1;
  hour = hour ? hour : 12;
  return {
    hour,
    minute: date?.getMinutes() || 0,
    second: date?.getSeconds() || 0,
    ampm: typeof hours !== "undefined" ? (hours >= 12 ? "PM" : "AM") : "AM",
  };
}

export default useTime;
