import React from "react";
import "./LogCard.scss";

const LogCard = props => {
  const { message, created } = props;

  let time = new Date(created).toLocaleString("en-US");

  return (
    <div className="LogCard">
      <div>{message && message}</div>
      <div>{time && time}</div>
    </div>
  );
};

export default LogCard;
