/** @jsxRuntime classic */
/** @jsx jsx */
import { useRef, useState } from "react";
import { jsx } from "@emotion/react";
import { useCallback } from "react";
import { usePopper } from "react-popper";
import DateRangePicker, { DateRangePickerProps } from "../DateRangePicker";
import { useOnClickOutside } from "../../hooks/src";
import { createStyles } from "../../utils/createStyles";

const cssStyles = createStyles({
  tooltip: {
    background: "#fff",
    borderRadius: "4px",
    border: `1px solid #ddd`,
    zIndex: 3001,
    '&[data-popper-placement^="top"]': {
      "#react-daterange-input__arrow": {
        bottom: -4,
      },
    },
    '&[data-popper-placement^="bottom"]': {
      "#react-daterange-input__arrow": {
        top: -4,
      },
    },
    '&[data-popper-placement^="left"]': {
      "#react-daterange-input__arrow": {
        right: -4,
      },
    },
    '&[data-popper-placement^="right"]': {
      "#react-daterange-input__arrow": {
        left: -4,
      },
    },
  },
  arrow: {
    position: "absolute",
    width: 8,
    height: 8,
    background: "inherit",
    visibility: "hidden",
    "&:before": {
      position: "absolute",
      width: 8,
      height: 8,
      background: "inherit",
      visibility: "visible",
      content: "''",
      transform: "rotate(45deg)",
      borderTop: `1px solid #ddd`,
      borderLeft: `1px solid #ddd`,
    },
  },
});

interface DateRangeInputProps extends DateRangePickerProps {}

function DefaultInput({ ...rest }) {
  return (
    <div>
      <input {...rest} />
    </div>
  );
}

function DateRangeInput({
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
}: DateRangeInputProps) {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const [arrowElement, setArrowElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom",
    modifiers: [
      { name: "arrow", options: { element: arrowElement } },
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
    ],
  });
  const ref = useRef(null);

  const handleClickOutside = useCallback(() => {
    setReferenceElement(null);
  }, []);

  const toggle = useCallback((e) => {
    setReferenceElement(e?.target);
  }, []);

  useOnClickOutside(ref, handleClickOutside);

  return (
    <div ref={ref}>
      <div>
        <DefaultInput onClick={toggle} />
      </div>
      {referenceElement && (
        <div
          className="react-daterange-input__tooltip"
          css={cssStyles.tooltip}
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <div style={{ width: 600 }}>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              showOutsideMonth={showOutsideMonth}
              showTimeSelect={showTimeSelect}
              showSecond={showSecond}
              minBookingDate={minBookingDate}
              maxBookingDate={maxBookingDate}
              unavailableDates={unavailableDates}
              changeActiveMonthOnSelect={changeActiveMonthOnSelect}
              format={format}
              autoApply={autoApply}
              onCancel={() => {}}
              onApply={() => {}}
            />
          </div>
          <div
            id="react-daterange-input__arrow"
            ref={setArrowElement}
            style={styles.arrow}
            css={cssStyles.arrow}
          />
        </div>
      )}
    </div>
  );
}

export default DateRangeInput;
