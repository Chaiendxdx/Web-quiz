import { useState, useEffect } from "react";

const Countdown = (props) => {
  const { onTimeUp } = props;
  const [duration, setDuration] = useState(6000);
  const toHHMMSS = (secs) => {
    const sec_num = parseInt(secs, 10);
    const hours = Math.floor(sec_num / 3600);
    const minutes = Math.floor(sec_num / 60) % 60;
    const seconds = sec_num % 60;

    return [hours, minutes, seconds]
      .map((v) => (v < 10 ? "0" + v : v))
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  };

  useEffect(() => {
    if (duration === 0) {
      onTimeUp();
      return;
    }
    let idInterval = setInterval(() => {
      setDuration(duration - 1);
    }, 1000);

    return () => {
      clearInterval(idInterval);
    };
  }, [duration]);

  return <div className="countdown-container">{toHHMMSS(duration)}</div>;
};
export default Countdown;
