import { IconContext } from "react-icons";

export default function ({
  Icon,
  color = "white",
  size = "20px",
  eventFunction,
}) {
  return (
    <IconContext.Provider value={{ color: color, size: size }}>
      <div onClick={eventFunction}>
        <Icon />
      </div>
    </IconContext.Provider>
  );
}
