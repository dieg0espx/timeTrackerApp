import { db } from "../config/connection";
import React, { useMemo } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Clock from "react-live-clock";

function UserInformation(props) {
  const [startedAt, setStartedAt] = useState(props.startedAt);
  const [workedHrs, setWorkedHrs] = useState(0);
  const [workedMins, setWorkedMins] = useState(0);

  function getCurrentDate(separator = " / ") {
    let newDate = new Date();
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    return `${month < 10 ? `0${month}` : `${month}`}${separator}${
      date < 10 ? `0${date}` : `${date}`
    }${separator}${year}`;
  }

  function calculateTime() {
    setWorkedHrs(0);
    setWorkedMins(0);

    function getCurrentTime() {
      return new Date().getHours() + ":" + new Date().getMinutes();
    }

    let started = props.startedAt.split(":");
    let startedHR = parseInt(started[0]);
    let startedMIN = parseInt(started[1]);
    let currentHR = parseInt(getCurrentTime().split(":")[0]);
    let currentMIN = parseInt(getCurrentTime().split(":")[1]);
    let tot = currentHR * 60 + currentMIN - (startedHR * 60 + startedMIN);
    setWorkedHrs(parseInt(tot / 60));
    setWorkedMins(tot % 60);
  }

  useEffect(() => {
    calculateTime();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      calculateTime();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="wrapper-userInformation">
      <div className="dateTime">
        <p id="date"> {getCurrentDate()} </p>
        <p id="time">
          {" "}
          <Clock format={"HH:mm:ss"} ticking={true} timezone={"US/Central"} />
        </p>
      </div>
      <h2> {props.name} </h2>
      <p> {props.position} </p>

      <div className="additionalInformation" style={{ display: props.isWorking ? "block" : "none" }}>
        <div className={props.isWorking ? "active-indicator" : "indicator"} ></div>
        <p> {props.projectName}</p>
        <h3> {workedHrs} hr, {workedMins} mins. </h3>
      </div>
    </div>
  );
}

export default UserInformation;
