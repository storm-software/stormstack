"use client";

import {
  getRandomInt,
  getRandomIntRange
} from "@stormstack/core-shared-utilities";
import { useEffect, useState } from "react";

export default function VhsTitleBar() {
  const [seconds, setSeconds] = useState(null);
  const [minutes, setMinutes] = useState(null);
  const [hours, setHours] = useState(null);

  useEffect(() => {
    if (seconds === null || minutes === null || hours === null) {
      setSeconds(getRandomInt(59));
      setMinutes(getRandomIntRange(10, 59));
      setHours(getRandomIntRange(10, 24));
    }

    const interval = setInterval(() => {
      setSeconds((seconds + 1) % 60);
      if (seconds === 59) {
        setMinutes((minutes + 1) % 60);
        if (minutes === 59) {
          setHours((hours + 1) % 24);
        }
      }
    }, 250);

    return () => clearInterval(interval);
  }, [hours, minutes, seconds, setSeconds, setMinutes, setHours]);

  return (
    <div className="m-auto bg-black/40 px-12 py-3 flex items-center">
      <p className="vhs-text text-3xl leading-none text-primary/70 slashed-zero">
        TCR 11-10 {hours === null ? 19 : hours < 10 ? `0${hours}` : hours}:
        {minutes === null ? 37 : minutes < 10 ? `0${minutes}` : minutes}:
        {seconds === null ? 11 : seconds < 10 ? `0${seconds}` : seconds}
      </p>
    </div>
  );
}
