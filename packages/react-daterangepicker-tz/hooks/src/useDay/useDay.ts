import React, { useCallback } from "react";
import addDays from "date-fns/addDays";
import isToday from "date-fns/isToday";

interface UseDayProps {
  date: Date;
  focusedDate: Date | null;
  isDateFocused(date: Date): boolean;
  isDateSelected(date: Date): boolean;
  isDateHovered(date: Date): boolean;
  isDateBlocked(date: Date): boolean;
  isFirstOrLastSelectedDate(date: Date): boolean;
  isStartDate(date: Date): boolean;
  isEndDate(date: Date): boolean;
  onDateFocus(date: Date): void;
  onDateSelect(date: Date): void;
  onDateHover(date: Date): void;

  // Not used anymore
  dayRef?: React.RefObject<HTMLButtonElement>;
}

function useDay({
  date,
  focusedDate,
  isDateSelected,
  isDateFocused,
  isFirstOrLastSelectedDate,
  isStartDate,
  isEndDate,
  isDateHovered,
  isDateBlocked,
  onDateSelect,
  onDateFocus,
  onDateHover,
}: UseDayProps) {
  const onClick = useCallback(() => onDateSelect(date), [date, onDateSelect]);
  const onMouseEnter = useCallback(
    () => onDateHover(date),
    [date, onDateHover]
  );
  const disabled = isDateBlocked(date) && !isDateHovered(date);

  return {
    tabIndex: focusedDate === null || isDateFocused(date) ? 0 : -1,
    isSelected: isDateSelected(date),
    isSelectedStartOrEnd: isFirstOrLastSelectedDate(date),
    isDateStart: isStartDate(date),
    isDateEnd: isEndDate(date),
    isWithinHoverRange: isDateHovered(date),
    disabledDate: disabled,
    isToday: isToday(date),
    onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "ArrowRight") {
        onDateFocus(addDays(date, 1));
      } else if (e.key === "ArrowLeft") {
        onDateFocus(addDays(date, -1));
      } else if (e.key === "ArrowUp") {
        onDateFocus(addDays(date, -7));
      } else if (e.key === "ArrowDown") {
        onDateFocus(addDays(date, 7));
      }
    },
    onClick: disabled ? () => {} : onClick,
    onMouseEnter,
  };
}

export default useDay;
