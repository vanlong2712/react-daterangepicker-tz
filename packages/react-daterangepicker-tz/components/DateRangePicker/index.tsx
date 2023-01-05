/** @jsxRuntime classic */
/** @jsx jsx */
import { useMemo, useState } from "react";
import { jsx } from "@emotion/react";
import Month from "./Month";
import DatepickerContext from "./datepickerContext";
import { FocusedInput, START_DATE, useDatepicker } from "../../hooks/src";
import { createStyles } from "../../utils/createStyles";

interface DateRangePickerProps {
  startDate?: Date | null;
  endDate?: Date | null;
  minBookingDate?: Date;
  maxBookingDate?: Date;
  unavailableDates?: Date[];
  changeActiveMonthOnSelect?: boolean;
  showOutsideMonth?: boolean;
  onChange: (data: any) => void;
}

function DateRangePicker({
  startDate = null,
  endDate = null,
  showOutsideMonth = true,
  minBookingDate,
  maxBookingDate,
  unavailableDates = [],
  changeActiveMonthOnSelect = true,
  onChange,
}: DateRangePickerProps) {
  const [state, setState] = useState({
    startDate,
    endDate,
    focusedInput: START_DATE as FocusedInput,
  });
  const {
    firstDayOfWeek,
    activeMonths,
    isDateSelected,
    isDateHovered,
    isFirstOrLastSelectedDate,
    isDateBlocked,
    isDateFocused,
    focusedDate,
    onDateHover,
    onDateSelect,
    onDateFocus,
    goToPreviousMonths,
    goToNextMonths,
    isStartDate,
    isEndDate,
  } = useDatepicker({
    startDate: state.startDate,
    endDate: state.endDate,
    focusedInput: state.focusedInput,
    minBookingDate,
    maxBookingDate,
    unavailableDates,
    changeActiveMonthOnSelect,
    onDatesChange: handleDateChange,
  });

  function handleDateChange(data: any) {
    if (!data.focusedInput) {
      const newData = { ...data, focusedInput: START_DATE };
      setState(newData);
      onChange(newData);
    } else {
      setState(data);
      onChange(data);
    }
  }

  const styles = useMemo(() => {
    return createStyles({
      display: "grid",
      margin: "32px 0 0",
      gridTemplateColumns: `repeat(auto-fill, minmax(240px, 1fr))`,
      gridGap: "0 32px",
    });
  }, []);

  console.log("DatePicker focusedInput", state.focusedInput);

  return (
    <DatepickerContext.Provider
      value={{
        focusedDate,
        isDateFocused,
        isDateSelected,
        isDateHovered,
        isDateBlocked,
        isFirstOrLastSelectedDate,
        onDateSelect,
        onDateFocus,
        onDateHover,
        isStartDate,
        isEndDate,
      }}
    >
      <div className="react-datepicker" css={styles}>
        {activeMonths.map((month, i) => (
          <Month
            key={`${month.year}-${month.month}`}
            year={month.year}
            month={month.month}
            firstDayOfWeek={firstDayOfWeek}
            showPrev={i === 0}
            showNext={i !== 0}
            showOutsideMonth={showOutsideMonth}
            goToPreviousMonths={goToPreviousMonths}
            goToNextMonths={goToNextMonths}
          />
        ))}
      </div>
    </DatepickerContext.Provider>
  );
}

export default DateRangePicker;
