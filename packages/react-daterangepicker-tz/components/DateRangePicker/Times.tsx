/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Fragment, useCallback } from "react";
import { TimeChangeProps, TimeProps } from ".";
import { FocusedInput } from "../../hooks/src";
import { createStyles } from "../../utils/createStyles";
import { zeroPad } from "../../utils/utils";

const styles = createStyles({
  times: {
    textAlign: "center",
    margin: "4px auto 0 auto",
    lineHeight: "30px",
    position: "relative",
  },
  timeSelect: {
    width: "50px",
    margin: "0 2px",
    background: "#eee",
    border: "1px solid #eee",
    padding: "2px",
    outline: "0",
    fontSize: "12px",
  },
  disabled: {
    pointerEvents: "none",
    opacity: 0.6,
  },
});

interface TimesProp {
  time: TimeProps;
  date?: Date | null;
  showSecond?: boolean;
  focusedInput: FocusedInput;
  onChange: ({ focusedInput, time }: TimeChangeProps) => void;
}

function Times({ time, date, showSecond, focusedInput, onChange }: TimesProp) {
  const { hours, minutes, seconds, ampm } = time;

  const handleChange = useCallback(
    (e) => {
      const timeObj: any = { hours, minutes, seconds, ampm };
      const name: string = e.target.name;
      const value: string = e.target.value;
      timeObj[name] = name === "ampm" ? value : parseInt(value);
      onChange({
        focusedInput,
        time: timeObj,
      });
    },
    [ampm, focusedInput, hours, minutes, onChange, seconds]
  );

  return (
    <div
      className="react-datepicker__times"
      css={[styles.times, !date && styles.disabled]}
    >
      <select
        className="react-datepicker__times-hour"
        css={styles.timeSelect}
        value={zeroPad(hours, 2)}
        name="hours"
        onChange={handleChange}
      >
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <option key={i + 1}>{zeroPad(i + 1, 2)}</option>
          ))}
      </select>
      :
      <select
        className="react-datepicker__times-minutes"
        css={styles.timeSelect}
        value={zeroPad(minutes, 2)}
        name="minutes"
        onChange={handleChange}
      >
        {Array(60)
          .fill(0)
          .map((_, i) => (
            <option key={i}>{zeroPad(i, 2)}</option>
          ))}
      </select>
      {showSecond ? (
        <Fragment>
          :
          <select
            className="react-datepicker__times-minutes"
            css={styles.timeSelect}
            value={zeroPad(seconds, 2)}
            name="seconds"
            onChange={handleChange}
          >
            {Array(60)
              .fill(0)
              .map((_, i) => (
                <option key={i}>{zeroPad(i, 2)}</option>
              ))}
          </select>
        </Fragment>
      ) : null}
      <select
        className="react-datepicker__times-ampm"
        css={styles.timeSelect}
        value={ampm}
        name="ampm"
        onChange={handleChange}
      >
        <option value="AM">AM</option>
        <option value="PM">PM</option>
      </select>
    </div>
  );
}

export default Times;
