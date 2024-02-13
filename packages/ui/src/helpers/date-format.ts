import { addDays, formatRFC7231, format } from "date-fns";

//  Formatting
export const formatDate = {
  /** Format RFC7231: Mon, 20 Apr 2020 16:20:00 GMT */
  full: formatRFC7231,

  /** Formats date and time in the local timezone: 2024.02.14 - 02:00 GMT+0 */
  fullLocal: (date: Date) => format(date, "yyyy.MM.dd - HH:mm z"),
};

//  Math
export const dateMath = {
  addDays: addDays,
};
