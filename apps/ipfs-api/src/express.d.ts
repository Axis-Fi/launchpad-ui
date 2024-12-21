import type { Profile } from "passport-twitter";
import "express";

// Tell Express that User is a Profile from passport (e.g. contains Twitter username)
declare global {
  namespace Express {
    interface User extends Profile {}
  }
}

export {};
