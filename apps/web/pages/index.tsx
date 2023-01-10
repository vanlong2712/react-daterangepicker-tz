import { useCallback, useState } from "react";
import {
  DateInput,
  DateRangeInput,
  DateRangePicker,
} from "react-daterangepicker-tz";

export default function Web() {
  const [date, setDate] = useState(null);
  const [dates, setDates] = useState({
    startDate: null,
    endDate: null,
  });

  const onSingleApply = useCallback((newDate: any) => {
    setDate(newDate);
  }, []);

  const onApply = useCallback((data: any) => {
    setDates({
      startDate: data.startDate,
      endDate: data.endDate,
    });
  }, []);

  return (
    <div>
      <h1>Date Input</h1>
      <div>
        <DateInput
          date={date}
          showTimeSelect
          showSecond
          onApply={onSingleApply}
        />
      </div>
      <h1>Date Range Input</h1>
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
