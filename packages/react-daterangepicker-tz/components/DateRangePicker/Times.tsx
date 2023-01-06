/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { Fragment, useCallback } from "react";
import { TimeChangeProps } from ".";
import { FocusedInput } from "../../hooks/src";
import useTime from "../../hooks/src/useTime";
import { createStyles } from "../../utils/createStyles";
import { convertTime12to24, zeroPad } from "../../utils/utils";

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
    opacity: 0.8,
  },
});

interface TimesProp {
  date?: Date | null;
  showSecond?: boolean;
  focusedInput: FocusedInput;
  onChange: ({ focusedInput, time }: TimeChangeProps) => void;
}

function Times({ date, showSecond, focusedInput, onChange }: TimesProp) {
  const { hour, minute, second, ampm } = useTime({ date });
  console.log("date fo", focusedInput, date, { hour, minute, second, ampm });

  const handleChange = useCallback(
    (e) => {
      const timeObj: any = { hour, minute, second, ampm };
      const name: string = e.target.name;
      const value: string = e.target.value;
      console.log("name", name, value);
      timeObj[name] = name === "ampm" ? value : parseInt(value);
      onChange({
        focusedInput,
        time: convertTime12to24(
          `${[
            zeroPad(timeObj.hour, 2),
            zeroPad(timeObj.minute, 2),
            zeroPad(timeObj.second, 2),
          ].join(":")} ${timeObj.ampm}`
        ),
      });
    },
    [ampm, focusedInput, hour, minute, onChange, second]
  );

  return (
    <div
      className="react-datepicker__times"
      css={[styles.times, !date && styles.disabled]}
    >
      <select
        className="react-datepicker__times-hour"
        css={styles.timeSelect}
        value={zeroPad(hour, 2)}
        name="hour"
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
        value={zeroPad(minute, 2)}
        name="minute"
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
            value={zeroPad(second, 2)}
            name="second"
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
