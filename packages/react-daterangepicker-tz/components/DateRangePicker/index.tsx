/** @jsxRuntime classic */
/** @jsx jsx */
import { useEffect, useMemo, useState } from "react";
import { jsx } from "@emotion/react";
import classnames from "classnames";
import Month from "./Month";
import DatepickerContext from "./datepickerContext";
import {
  END_DATE,
  FocusedInput,
  START_DATE,
  useDatepicker,
} from "../../hooks/src";
import { createStyles } from "../../utils/createStyles";
import Times from "./Times";
import {
  getTimeFromDate,
  setTimeToDate,
} from "../../hooks/src/useTime/useTime";
import { formatDateString } from "../../utils/utils";

const styles = createStyles({
  datePicker: {
    display: "grid",
    gridTemplateColumns: `repeat(auto-fill, minmax(240px, 1fr))`,
    gridGap: "0 32px",
  },
  calendarLeft: {
    padding: "8px 0 8px 8px",
  },
  calendarRight: {
    padding: "8px 8px 8px 0",
  },
  btns: {
    clear: "both",
    textAlign: "right",
    padding: "8px",
    borderTop: "1px solid #ddd",
    lineHeight: "12px",
    verticalAlign: "middle",
  },
  btn: {
    display: "inline-block",
    textAlign: "center",
    whiteSpace: "nowrap",
    verticalAlign: "middle",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    MsUserSelect: "none",
    userSelect: "none",
    border: "1px solid transparent",
    borderRadius: "0.25rem",
    transition:
      "color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out",
    cursor: "pointer",
    marginLeft: "8px",
    fontSize: "12px",
    fontWeight: "bold",
    padding: "4px 8px",
    "&:focus": {
      outline: "none",
      boxShadow: "0 0 0 0.2rem rgb(0 123 255 / 25%)",
    },
    "&:disabled": {
      cursor: "auto",
      opacity: 0.65,
    },
  },
  btnDate: {
    display: "inline-block",
    fontSize: 12,
    paddingRight: 8,
  },
  btnCancel: {},
  btnApply: {
    color: "#fff",
    backgroundColor: "#007bff",
    borderColor: "#007bff",
    "&:disabled": {
      color: "#fff",
      backgroundColor: "#007bff",
      borderColor: "#007bff",
    },
  },
});

interface onApplyProps {
  startDate: Date | null;
  endDate: Date | null;
  focusedInput: FocusedInput;
}
export interface DateRangePickerProps {
  startDate?: Date | null;
  endDate?: Date | null;
  minBookingDate?: Date;
  maxBookingDate?: Date;
  unavailableDates?: Date[];
  changeActiveMonthOnSelect?: boolean;
  showOutsideMonth?: boolean;
  showTimeSelect?: boolean;
  showSecond?: boolean;
  format?: string;
  autoApply?: boolean;
  onCancel?: () => void;
  onApply?(data: onApplyProps): void;
}

export interface TimeProps {
  hours: number;
  minutes: number;
  seconds: number;
  ampm: string;
}

export interface TimeChangeProps {
  focusedInput: FocusedInput;
  time: TimeProps;
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
  format = "MM/DD/YYYY HH:mm:ss A",
  autoApply = false,
  onCancel,
  onApply,
}: DateRangePickerProps) {
  const [state, setState] = useState({
    startDate,
    endDate,
    focusedInput: START_DATE as FocusedInput,
  });
  const [timeState, setTimeState] = useState({
    start: getTimeFromDate(startDate),
    end: getTimeFromDate(endDate),
  });

  useEffect(() => {
    setState({
      startDate,
      endDate,
      focusedInput: START_DATE as FocusedInput,
    });
    setTimeState({
      start: getTimeFromDate(startDate),
      end: getTimeFromDate(endDate),
    });
  }, [endDate, startDate]);

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
      setTimeToDate({ date: newData.startDate, time: timeState.start });
      setTimeToDate({ date: newData.endDate, time: timeState.end });
      setState(newData);
      if (autoApply && onApply) {
        onApply(newData);
      }
    } else {
      setTimeToDate({ date: data.startDate, time: timeState.start });
      setTimeToDate({ date: data.endDate, time: timeState.end });
      setState(data);
      if (autoApply && onApply) {
        onApply(data);
      }
    }
  }

  function handleTimeChange({ focusedInput, time }: TimeChangeProps) {
    const newState = { ...state };
    const newTimeState = { ...timeState };
    const date =
      focusedInput === START_DATE ? newState.startDate : newState.endDate;
    const { hours, minutes, seconds, ampm } = time;
    setTimeToDate({ date, time });
    const targetTime =
      focusedInput === START_DATE ? newTimeState.start : newTimeState.end;
    targetTime.hours = hours;
    targetTime.minutes = minutes;
    targetTime.seconds = seconds;
    targetTime.ampm = ampm;
    setState(newState);
    if (autoApply && onApply) {
      onApply(newState);
    }
    setTimeState(newTimeState);
  }

  function handleApply() {
    onApply && onApply(state);
  }

  function handleCancel() {
    onCancel && onCancel();
  }

  const formatString = useMemo(() => {
    return [
      formatDateString({ date: state.startDate, format }),
      formatDateString({ date: state.endDate, format }),
    ]
      .filter((el) => !!el)
      .join(" - ");
  }, [format, state]);

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
          <div
            key={`${month.year}-${month.month}`}
            className={classnames({
              "react-datepicker__calendar-left": i === 0,
              "react-datepicker__calendar-right": i === 1,
            })}
            css={i === 0 ? styles.calendarLeft : styles.calendarRight}
          >
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
                time={i === 0 ? timeState.start : timeState.end}
                date={i === 0 ? state.startDate : state.endDate}
                showSecond={showSecond}
                focusedInput={i === 0 ? START_DATE : END_DATE}
                onChange={handleTimeChange}
              />
            )}
          </div>
        ))}
      </div>
      {!autoApply && (
        <div className="react-datepicker__btns" css={styles.btns}>
          <span className="react-datepicker__btns--date" css={styles.btnDate}>
            {formatString}
          </span>
          <button
            className="react-datepicker__btns--cancel"
            css={[styles.btn, styles.btnCancel]}
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="react-datepicker__btns--apply"
            css={[styles.btn, styles.btnApply]}
            onClick={handleApply}
            disabled={!state.startDate || !state.endDate}
          >
            Apply
          </button>
        </div>
      )}
    </DatepickerContext.Provider>
  );
}

export default DateRangePicker;
