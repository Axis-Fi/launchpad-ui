import type { Profile } from "passport";

// This tells Express that user objects is s Profile from passport (contains the Twitter username field)
declare global {
  namespace Express {
    interface User extends Profile {}
  }
}
