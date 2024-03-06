import { addDays, formatRFC7231, format } from "date-fns";

// Date formatting operations
export const formatDate = {
  /** Format RFC7231: Mon, 20 Apr 2020 16:20:00 GMT */
  full: formatRFC7231,

  /** Formats date and time in the local timezone: 2024.02.14 - 02:00 GMT+0 */
  fullLocal: (date: Date) => format(date, "yyyy.MM.dd - HH:mm z"),
};

// Date math operations
export const dateMath = {
  addDays,
};

export const getTimestamp = (date: Date) => Math.floor(date.getTime() / 1000);
export const getDuration = (days: number) => days * 24 * 60 * 60;

// Date utilities
export const dateHelpers = {
  getTimestamp,
  getDuration,
};
