import { useCallback, useState } from "react";
import {
  Calendar,
  DateRangeInput,
  DateRangePicker,
} from "react-daterangepicker-tz";

export default function Web() {
  const [dates, setDates] = useState({
    startDate: null,
    endDate: null,
  });

  const onApply = useCallback((data: any) => {
    setDates({
      startDate: data.startDate,
      endDate: data.endDate,
    });
  }, []);

  return (
    <div>
      <h1>Web</h1>
      <Calendar />
      <div style={{ maxWidth: 600 }}>
        <DateRangePicker
          startDate={dates.startDate}
          endDate={dates.endDate}
          showTimeSelect
          showSecond
          onCancel={() => {}}
          onApply={onApply}
          autoApply
        />
      </div>
      <div>
        <DateRangeInput
          startDate={dates.startDate}
          endDate={dates.endDate}
          showTimeSelect
          showSecond
          onApply={onApply}
        />
      </div>
    </div>
  );
}
