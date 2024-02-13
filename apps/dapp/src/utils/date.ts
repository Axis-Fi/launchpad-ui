import { addDays, formatRFC7231 } from "date-fns";

//  Formatting
export const formatDate = {
  /** Format RFC7231: Mon, 20 Apr 2020 16:20:00 GMT */
  full: formatRFC7231,
};

//  Math
export const dateMath = {
  addDays: addDays,
};
