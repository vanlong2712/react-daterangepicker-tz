/** @jsxRuntime classic */
/** @jsx jsx */
import { useState, Fragment } from "react";
import { jsx } from "@emotion/react";
import Month from "./Month";
import DatepickerContext from "./datepickerContext";
import {
  END_DATE,
  FocusedInput,
  START_DATE,
  useDatepicker,
} from "../../hooks/src";
import { createStyles } from "../../utils/createStyles";
import { zeroPad } from "../../utils/utils";
import Times from "./Times";

const styles = createStyles({
  datePicker: {
    display: "grid",
    margin: "32px 0 0",
    gridTemplateColumns: `repeat(auto-fill, minmax(240px, 1fr))`,
    gridGap: "0 32px",
  },
});

interface DateRangePickerProps {
  startDate?: Date | null;
  endDate?: Date | null;
  minBookingDate?: Date;
  maxBookingDate?: Date;
  unavailableDates?: Date[];
  changeActiveMonthOnSelect?: boolean;
  showOutsideMonth?: boolean;
  showTimeSelect?: boolean;
  showSecond?: boolean;
  onChange: (data: any) => void;
}

export interface TimeChangeProps {
  focusedInput: FocusedInput;
  time: string;
}

function DateRangePicker({
  startDate = null,
  endDate = null,
  showOutsideMonth = true,
  showTimeSelect = false,
  showSecond = false,
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

  function handleTimeChange({ focusedInput, time }: TimeChangeProps) {
    const newState = { ...state };
    const date =
      focusedInput === START_DATE ? newState.startDate : newState.endDate;
    const [hours, minutes, seconds] = time.split(":");
    date?.setHours(parseInt(hours));
    date?.setMinutes(parseInt(minutes));
    date?.setSeconds(parseInt(seconds));
    console.log("datedate", date);
    setState(newState);
    onChange(newState);
  }

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
      <div className="react-datepicker" css={styles.datePicker}>
        {activeMonths.map((month, i) => (
          <div key={`${month.year}-${month.month}`}>
            <Month
              year={month.year}
              month={month.month}
              firstDayOfWeek={firstDayOfWeek}
              showPrev={i === 0}
              showNext={i !== 0}
              showOutsideMonth={showOutsideMonth}
              goToPreviousMonths={goToPreviousMonths}
              goToNextMonths={goToNextMonths}
            />
            {showTimeSelect && (
              <Times
                date={i === 0 ? state.startDate : state.endDate}
                showSecond={showSecond}
                focusedInput={i === 0 ? START_DATE : END_DATE}
                onChange={handleTimeChange}
              />
            )}
          </div>
        ))}
      </div>
    </DatepickerContext.Provider>
  );
}

export default DateRangePicker;
