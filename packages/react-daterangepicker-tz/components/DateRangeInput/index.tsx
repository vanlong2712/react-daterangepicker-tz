/** @jsxRuntime classic */
/** @jsx jsx */
import { useEffect, useRef, useState } from "react";
import { jsx } from "@emotion/react";
import { useCallback } from "react";
import { usePopper } from "react-popper";
import DateRangePicker, { DateRangePickerProps } from "../DateRangePicker";
import { createStyles } from "../../utils/createStyles";
import { formatDateString } from "../../utils/utils";
import dayjs from "dayjs";
import { useOnClickOutside } from "usehooks-ts";

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
}

function DefaultInput({ ...rest }) {
  return <input {...rest} />;
}

function getInputValue({
  startDate,
  endDate,
  format,
}: {
  startDate: Date | null;
  endDate: Date | null;
  format: string;
}) {
  if (!dayjs(startDate).isValid() || !dayjs(endDate).isValid) {
    return "";
  }
  return [
    formatDateString({ date: startDate, format }),
    formatDateString({ date: endDate, format }),
  ].join(" - ");
}

function DateRangeInput({
  width = 600,
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
  onApply,
  onCancel,
  CustomInput = DefaultInput,
  popperOptions = {},
}: DateRangeInputProps) {
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const [arrowElement, setArrowElement] = useState<HTMLDivElement | null>(null);
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

  const [state, setState] = useState({
    startDate,
    endDate,
  });

  const [inputValue, setInputValue] = useState(
    getInputValue({ startDate, endDate, format })
  );

  useEffect(() => {
    setState({ startDate, endDate });
  }, [startDate, endDate]);

  useEffect(() => {
    setInputValue(getInputValue({ startDate, endDate, format }));
  }, [startDate, endDate, format]);

  const handleClickOutside = useCallback(
    ({ isReset }) => {
      setReferenceElement(null);
      if (isReset) {
        setState({ startDate, endDate });
        setInputValue(getInputValue({ startDate, endDate, format }));
      }
    },
    [endDate, format, startDate]
  );

  const toggle = useCallback((e) => {
    setReferenceElement(e?.target);
  }, []);

  useOnClickOutside(ref, () => handleClickOutside({ isReset: true }));

  const onChange = useCallback((e) => {
    const { value } = e.target;
    setInputValue(value);
    if (value) {
      const [start, end] = value.split(" - ");
      if (start && end && dayjs(start).isValid() && dayjs(end).isValid()) {
        setState({
          startDate: new Date(start),
          endDate: new Date(end),
        });
      }
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
        onApply(data);
        setInputValue(
          getInputValue({
            startDate: data.startDate,
            endDate: data.endDate,
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
        isfocused={!!referenceElement}
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
              startDate={state.startDate}
              endDate={state.endDate}
              showOutsideMonth={showOutsideMonth}
              showTimeSelect={showTimeSelect}
              showSecond={showSecond}
              minBookingDate={minBookingDate}
              maxBookingDate={maxBookingDate}
              unavailableDates={unavailableDates}
              changeActiveMonthOnSelect={changeActiveMonthOnSelect}
              format={format}
              autoApply={autoApply}
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

export default DateRangeInput;
