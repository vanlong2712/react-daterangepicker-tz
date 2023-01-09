/** @jsxRuntime classic */
/** @jsx jsx */
import { useRef, useContext, useMemo } from "react";
import { jsx } from "@emotion/react";
import DatepickerContext from "./datepickerContext";
import getColor from "../../utils/getColor";
import { useDay } from "../../hooks/src";
import { createStyles } from "../../utils/createStyles";
import { zeroPad } from "../../utils/utils";
import classnames from "classnames";
import { UseMonthResultDays } from "../../hooks/src/useMonth/useMonth";

function Day({ dayLabel, date, outsideMonth }: UseMonthResultDays) {
  const dayRef = useRef(null);
  const {
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstOrLastSelectedDate,
    isStartDate,
    isEndDate,
    onDateSelect,
    onDateFocus,
    onDateHover,
  } = useContext(DatepickerContext);
  const {
    isSelected,
    isSelectedStartOrEnd,
    isWithinHoverRange,
    disabledDate,
    isDateStart,
    isDateEnd,
    isToday,
    onClick,
    onKeyDown,
    onMouseEnter,
    tabIndex,
  } = useDay({
    date,
    focusedDate,
    isDateFocused,
    isDateSelected,
    isDateHovered,
    isDateBlocked,
    isFirstOrLastSelectedDate,
    isStartDate,
    isEndDate,
    onDateFocus,
    onDateSelect,
    onDateHover,
    dayRef,
  });

  const getColorFn = useMemo(() => {
    return getColor(
      isSelected,
      isSelectedStartOrEnd,
      isWithinHoverRange,
      disabledDate
    );
  }, [disabledDate, isSelected, isSelectedStartOrEnd, isWithinHoverRange]);

  const styles = useMemo(() => {
    return createStyles({
      common: {
        padding: "8px",
        border: 0,
        color: getColorFn({
          selectedFirstOrLastColor: "#FFFFFF",
          normalColor: "#001217",
          selectedColor: "#FFFFFF",
          rangeHoverColor: "#FFFFFF",
          disabledColor: "#808285",
        }),
        background: getColorFn({
          selectedFirstOrLastColor: "#00aeef",
          normalColor: "#FFFFFF",
          selectedColor: "#71c9ed",
          rangeHoverColor: "#71c9ed",
          disabledColor: "#FFFFFF",
        }),
        "&:hover": {
          backgroundColor: "#eee",
          borderColor: "transparent",
          color: "inherit",
          cursor: "pointer",
        },
      },
      outside: {
        backgroundColor: "#fff",
        borderColor: "transparent",
        color: "#999",
      },
      selectedStart: {
        borderRadius: `4px 0 0 4px`,
      },
      selectedEnd: {
        borderRadius: `0 4px 4px 0`,
      },
    });
  }, [getColorFn]);

  if (!dayLabel) {
    return <div />;
  }

  return (
    <button
      className={classnames(
        `react-datepicker__day react-datepicker__day--${zeroPad(dayLabel, 3)}`,
        {
          "react-datepicker__day--in-selecting-range": isWithinHoverRange,
          "react-datepicker__day--keyboard-selected":
            isSelected && isSelectedStartOrEnd,
          "react-datepicker__day--range-start": isDateStart && !isDateEnd,
          "react-datepicker__day--range-end": !isDateStart && isDateEnd,
          "react-datepicker__day--in-range": isSelected,
          "react-datepicker__day--today": isToday,
          "react-datepicker__day--outside-month": outsideMonth,
        }
      )}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseEnter={onMouseEnter}
      tabIndex={tabIndex}
      type="button"
      ref={dayRef}
      css={[
        styles.common,
        isDateStart && !isDateEnd && styles.selectedStart,
        !isDateStart && isDateEnd && styles.selectedEnd,
        outsideMonth && styles.outside,
      ]}
    >
      {zeroPad(dayLabel, 2)}
    </button>
  );
}

export default Day;
