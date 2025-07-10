export const formatDateRange = (
  startDate: string | Date,
  endDate: string | Date
): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const startFormattedDate = start.toLocaleDateString("en-US", options);
  const endFormattedDate = end.toLocaleDateString("en-US", options);
  const startFormattedTime = start.toLocaleTimeString("en-US", timeOptions);
  const endFormattedTime = end.toLocaleTimeString("en-US", timeOptions);

  if (start.toDateString() === end.toDateString()) {
    return `${startFormattedDate} | ${startFormattedTime} - ${endFormattedTime}`;
  } else {
    return `${startFormattedDate} ${startFormattedTime} - ${endFormattedDate} ${endFormattedTime}`;
  }
};