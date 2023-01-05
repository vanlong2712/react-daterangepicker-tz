/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { FirstDayOfWeek, useMonth } from "../../hooks/src";
import { createStyles } from "../../utils/createStyles";
import Day from "./Day";
import NavButton from "./NavButton";

const styles = createStyles({
  header: {
    position: "relative",
    borderBottom: "1px solid rgba(0,0,0,.15)",
    borderTopLeftRadius: "0.3rem",
    padding: "8px 0",
    textAlign: "center",
  },
  monthLabel: {
    textAlign: "center",
    margin: "0 0 16px",
  },
  weekdayContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    justifyContent: "center",
    marginBottom: "10px",
    fontWeight: 500,
  },
  weekdayLabel: {
    textAlign: "center",
    color: "#000",
  },
  dayContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    justifyContent: "center",
    margin: `0.4rem 0`,
    textAlign: "center",
  },
  prevButton: {
    position: "absolute",
    left: 0,
  },
  nextButton: {
    position: "absolute",
    right: 0,
  },
});

interface Month {
  year: number;
  month: number;
  firstDayOfWeek: FirstDayOfWeek;
  showPrev: boolean;
  showNext: boolean;
  showOutsideMonth: boolean;
  goToPreviousMonths: () => void;
  goToNextMonths: () => void;
}

function Month({
  year,
  month,
  firstDayOfWeek,
  showPrev,
  showNext,
  showOutsideMonth,
  goToPreviousMonths,
  goToNextMonths,
}: Month) {
  const { days, weekdayLabels, monthLabel } = useMonth({
    year,
    month,
    firstDayOfWeek,
    showOutsideMonth,
  });

  return (
    <div>
      <div className="react-datepicker__header" css={styles.header}>
        {showPrev && (
          <div css={styles.prevButton}>
            <NavButton type="previous" onClick={goToPreviousMonths}>
              Previous Month
            </NavButton>
          </div>
        )}
        {showNext && (
          <div css={styles.nextButton}>
            <NavButton type="next" onClick={goToNextMonths}>
              Next Month
            </NavButton>
          </div>
        )}
        <div
          className="react-datepicker__current-month"
          css={styles.monthLabel}
        >
          <strong>{monthLabel}</strong>
        </div>
        <div
          className="react-datepicker__day-names"
          css={styles.weekdayContainer}
        >
          {weekdayLabels.map((dayLabel) => (
            <div
              className="react-datepicker__day-name"
              css={styles.weekdayLabel}
              key={dayLabel}
            >
              {dayLabel}
            </div>
          ))}
        </div>
      </div>
      <div className="react-datepicker__month" css={styles.dayContainer}>
        {days.map((day, index) => {
          if (typeof day === "object") {
            return (
              <Day
                date={day.date}
                key={day.date.toString()}
                dayLabel={day.dayLabel}
                outsideMonth={day.outsideMonth}
                type={day.type}
              />
            );
          }

          return <div key={index} />;
        })}
      </div>
    </div>
  );
}

export default Month;
