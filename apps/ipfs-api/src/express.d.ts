import type { Profile } from "passport-twitter";
import "express";

// Tell Express that User is a Profile from passport (e.g. contains Twitter username etc.)
declare global {
  namespace Express {
    interface User extends Profile {
      name: string;
      id_str: string;
      _json: {
        description: string;
        profile_image_url_https: string;
        profile_banner_url: string;
        url: string;
      };
    }
  }
}

export {};
