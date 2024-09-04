export const convertTo24HourFormat = (time12h) => {
  const [time, period] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${(minutes || 0)
    .toString()
    .padStart(2, "0")}:00`;
};

export const formatTimestamp = (timestamp) => {
  return new Date(timestamp)
    .toLocaleDateString("en-GB")
    .replace(/\//g, "-")
    .slice(0, 10); // Adjust this slice if needed
};

export const monthformat = (timestamp) => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(timestamp));
};

export const addHoursToDate = (dateStr, hoursStr) => {
  const [day, month, year, hours, minutes, seconds] = dateStr
    .split(/[- :]/)
    .map(Number);
  const date = new Date(year, month - 1, day, hours, minutes, seconds);

  const hoursToAdd = parseInt(hoursStr, 10);
  date.setHours(date.getHours() + hoursToAdd);

  const formattedDate =
    [
      ("0" + date.getDate()).slice(-2),
      ("0" + (date.getMonth() + 1)).slice(-2),
      date.getFullYear(),
    ].join("-") +
    " " +
    [
      ("0" + date.getHours()).slice(-2),
      ("0" + date.getMinutes()).slice(-2),
      ("0" + date.getSeconds()).slice(-2),
    ].join(":");

  return formattedDate;
};
