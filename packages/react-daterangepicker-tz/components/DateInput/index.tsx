/** @jsxRuntime classic */
/** @jsx jsx */
import { useEffect, useRef, useState } from "react";
import { jsx } from "@emotion/react";
import { useCallback } from "react";
import { usePopper } from "react-popper";
import DateRangePicker, { DateRangePickerProps } from "../DateRangePicker";
import { useOnClickOutside } from "../../hooks/src";
import { createStyles } from "../../utils/createStyles";
import { formatDateString } from "../../utils/utils";
import dayjs from "dayjs";

const cssStyles = createStyles({
  inputWrapper: {
    width: "fit-content",
  },
  tooltip: {
    background: "#fff",
    borderRadius: "4px",
    border: `1px solid #ddd`,
    zIndex: 3001,
    '&[data-popper-placement^="top"]': {
      "#react-daterange-input__arrow": {
        bottom: -4,
        "&:before": {
          borderBottom: `1px solid #ddd`,
          borderRight: `1px solid #ddd`,
        },
      },
    },
    '&[data-popper-placement^="bottom"]': {
      "#react-daterange-input__arrow": {
        top: -4,
        "&:before": {
          borderTop: `1px solid #ddd`,
          borderLeft: `1px solid #ddd`,
        },
      },
    },
    '&[data-popper-placement^="left"]': {
      "#react-daterange-input__arrow": {
        right: -4,
        "&:before": {
          borderTop: `1px solid #ddd`,
          borderRight: `1px solid #ddd`,
        },
      },
    },
    '&[data-popper-placement^="right"]': {
      "#react-daterange-input__arrow": {
        left: -4,
        "&:before": {
          borderBottom: `1px solid #ddd`,
          borderLeft: `1px solid #ddd`,
        },
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
    },
  },
});

interface DateRangeInputProps extends DateRangePickerProps {
  width?: number | string;
  CustomInput?: React.FunctionComponent<any>;
  popperOptions?: object;
  date?: Date | null;
}

function DefaultInput({ ...rest }) {
  return <input {...rest} />;
}

function getInputValue({
  startDate,
  format,
}: {
  startDate: Date | null;
  format: string;
}) {
  if (!dayjs(startDate).isValid()) {
    return "";
  }
  return formatDateString({ date: startDate, format });
}

function DateInput({
  width = 300,
  date = null,
  showOutsideMonth = true,
  showTimeSelect = false,
  showSecond = false,
  minBookingDate,
  maxBookingDate,
  unavailableDates = [],
  changeActiveMonthOnSelect = true,
  format = "MM/DD/YYYY HH:mm:ss A",
  autoApply = false,
  onApply,
  onCancel,
  CustomInput = DefaultInput,
  popperOptions = {},
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
    ...popperOptions,
  });
  const ref = useRef(null);

  const [stateDate, setStateDate] = useState(date);

  console.log("datedate", date);

  const [inputValue, setInputValue] = useState(
    getInputValue({ startDate: date, format })
  );

  useEffect(() => {
    setStateDate(date);
  }, [date]);

  useEffect(() => {
    setInputValue(getInputValue({ startDate: date, format }));
  }, [format, date]);

  const handleClickOutside = useCallback(
    ({ isReset }) => {
      setReferenceElement(null);
      if (isReset) {
        setStateDate(date);
        setInputValue(getInputValue({ startDate: date, format }));
      }
    },
    [date, format]
  );

  const toggle = useCallback((e) => {
    setReferenceElement(e?.target);
  }, []);

  useOnClickOutside(ref, () => handleClickOutside({ isReset: true }));

  const onChange = useCallback((e) => {
    const { value } = e.target;
    setInputValue(value);
    if (value && dayjs(value).isValid()) {
      setStateDate(new Date(value));
    }
  }, []);

  const handleCancel = useCallback(() => {
    handleClickOutside({ isReset: true });
    if (onCancel) {
      onCancel();
    }
  }, [handleClickOutside, onCancel]);

  const handleApply = useCallback(
    (data) => {
      if (onApply) {
        onApply(data.startDate);
        setInputValue(
          getInputValue({
            startDate: data.startDate,
            format,
          })
        );
      }
      handleClickOutside({ isReset: false });
    },
    [format, handleClickOutside, onApply]
  );

  return (
    <div
      ref={ref}
      className="react-daterange-input__wrapper"
      css={cssStyles.inputWrapper}
    >
      <CustomInput
        className="react-daterange-input"
        value={inputValue}
        isFocused={!!referenceElement}
        onClick={toggle}
        onChange={onChange}
      />
      {referenceElement && (
        <div
          className="react-daterange-input__tooltip"
          css={cssStyles.tooltip}
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
        >
          <div className="react-daterange-input__datepicker" style={{ width }}>
            <DateRangePicker
              startDate={stateDate}
              endDate={stateDate}
              showOutsideMonth={showOutsideMonth}
              showTimeSelect={showTimeSelect}
              showSecond={showSecond}
              minBookingDate={minBookingDate}
              maxBookingDate={maxBookingDate}
              unavailableDates={unavailableDates}
              changeActiveMonthOnSelect={changeActiveMonthOnSelect}
              format={format}
              autoApply={autoApply}
              isSingleSelect
              onCancel={handleCancel}
              onApply={handleApply}
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

export default DateInput;
