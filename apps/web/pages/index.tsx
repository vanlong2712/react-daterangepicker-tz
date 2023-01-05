import { Calendar, DateRangePicker } from "react-daterangepicker-tz";

export default function Web() {
  return (
    <div>
      <h1>Web</h1>
      <Calendar />
      <div style={{ width: 600 }}>
        <DateRangePicker
          startDate={new Date("Wed Mar 01 2023 00:00:00 GMT+0700")}
          endDate={new Date("Sat Mar 11 2023 00:00:00 GMT+0700")}
          onChange={() => {}}
        />
      </div>
    </div>
  );
}
