import React, { memo, useContext, useRef } from "react";
import "../style/components/custom_components.css";
import { AcademyContext } from "../pages/Academy";

const Heading = memo(function ({ content, contentColor, margin, hrBackground, hrWidth }) {
  return (
    <div className="section-header  mb-5">
      <h1 className={`header-text h1-sm fit-content mx-${margin} mt-0`} style={{ color: contentColor }}>
        {content}
      </h1>
      <hr className={`styled-hr mx-${margin}`} style={{ backgroundColor: hrBackground, width: hrWidth }} />
    </div>
  );
});

Heading.defaultProps = {
  colors: {
    contentColor: "#313131",
    hrBackground: "#c49f55",
  },
};

const ToggleButton = memo(function ({ func, background, linesColor }) {
  const toggleButton = useRef();
  function handleClick(event) {
    event.stopPropagation();
    toggleButton.current.classList.toggle("clicked");
    func();
  }

  return (
    <div
      ref={toggleButton}
      className="toggle p-1 d-md-none pointer d-flex justify-content-center align-items-center rounded-circle"
      style={{ backgroundColor: background }}
      onClick={handleClick}
    >
      <div className="w-100 h-100">
        <div
          className="w-100 position-relative transition my-1"
          style={{
            backgroundColor: linesColor ? linesColor : "white",
          }}
        ></div>
        <div
          className="w-100 position-relative transition my-1"
          style={{
            backgroundColor: linesColor ? linesColor : "white",
          }}
        ></div>
        <div
          className="w-100 position-relative transition my-1"
          style={{
            backgroundColor: linesColor ? linesColor : "white",
          }}
        ></div>
      </div>
    </div>
  );
});

function AcademyHeading({ content, color }) {
  const theme_color = useContext(AcademyContext).academy.theme_color;
  return (
    <h3
      className="academy-heading mx-auto mt-0 mb-2 p-2 rounded text-center"
      style={{
        backgroundColor: theme_color,
        color: color ? color : "#fff",
      }}
    >
      {content}
    </h3>
  );
}

const Button = memo(
  function ({ handleClick, classes, content, style }) {
    return (
      <button
        onClick={handleClick}
        className={`${classes ? classes : ""} main border-0`}
        style={{ width: 60, height: 30, backgroundColor: "#e4e4e4", borderRadius: 7, transition: ".3s linear", ...style }}
      >
        {content}
      </button>
    );
  },
  (prevProps, nextProps) => nextProps === prevProps
);

function FilterField({ name, choices }) {
  return (
    <div className="filter-field">
      <input className="w-100" type="text" name={name} id={name} placeholder={`اختر  ${name}`} />
      <ul className="filter-choices overflow-hidden">
        {choices.map((choice, index) => (
          <li className="pointer px-3 py-2" key={index}>
            {choice}
          </li>
        ))}
      </ul>
    </div>
  );
}

export { ToggleButton, Heading, AcademyHeading, Button, FilterField };
