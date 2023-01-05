import React from "react";

interface ContextProps {
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
}

export const datepickerContextDefaultValue: ContextProps = {
  focusedDate: null,
  isDateFocused: () => false,
  isDateSelected: () => false,
  isDateHovered: () => false,
  isDateBlocked: () => false,
  isFirstOrLastSelectedDate: () => false,
  isStartDate: () => false,
  isEndDate: () => false,
  onDateFocus: () => {},
  onDateHover: () => {},
  onDateSelect: () => {},
};

export default React.createContext(datepickerContextDefaultValue);
