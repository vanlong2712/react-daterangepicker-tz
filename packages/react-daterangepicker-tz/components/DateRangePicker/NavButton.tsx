/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/react";
import { createStyles } from "../../utils/createStyles";

const styles = createStyles({
  button: {
    alignItems: "center",
    background: "none",
    border: "none",
    cursor: "pointer",
    display: "flex",
    height: "32px",
    justifyContent: "center",
    overflow: "hidden",
    padding: "0",
    position: "absolute",
    textAlign: "center",
    textIndent: "-999em",
    top: "-6px",
    width: "32px",
    zIndex: "1",
    "&:hover :before": {
      borderColor: "#a6a6a6",
    },
  },
  buttonPrev: {
    left: 2,
  },
  buttonNext: {
    right: 2,
  },
  icon: {
    fontSize: "20px",
    position: "relative",
    top: "-1px",
    width: "0",
    "&:before": {
      borderColor: "#ccc",
      borderStyle: "solid",
      borderWidth: "3px 3px 0 0",
      content: '""',
      display: "block",
      height: "9px",
      position: "absolute",
      top: "6px",
      width: "9px",
    },
  },
  iconPrev: {
    right: -2,
    "&:before": { right: "-7px", transform: "rotate(225deg)" },
  },
  iconNext: {
    left: -2,
    "&:before": { left: "-7px", transform: "rotate(45deg)" },
  },
});

interface NavButtonProps {
  type?: string;
  children: unknown;
  onClick: () => void;
}

export default function NavButton({ type, children, onClick }: NavButtonProps) {
  return (
    <button
      css={[
        styles.button,
        type === "previous" ? styles.buttonPrev : styles.buttonNext,
      ]}
      className={`reactreact-datepicker__navigation react-datepicker__navigation--${type}`}
      type="button"
      onClick={onClick}
      aria-label={type === "previous" ? "Previous Month" : "Next Month"}
    >
      <span
        css={[
          styles.icon,
          type === "previous" ? styles.iconPrev : styles.iconNext,
        ]}
        className={`react-datepicker__navigation-icon react-datepicker__navigation-icon--${type}`}
      >
        {children}
      </span>
    </button>
  );
}
