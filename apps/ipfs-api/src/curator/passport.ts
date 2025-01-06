import * as dotenv from "dotenv";
import passport from "passport";
import { Strategy as TwitterStrategy } from "passport-twitter";

dotenv.config();

const getCredentials = () => {
  if (
    !process.env.TWITTER_CONSUMER_KEY ||
    !process.env.TWITTER_CONSUMER_SECRET ||
    !process.env.TWITTER_CALLBACK_URL
  ) {
    throw new Error("Missing Twitter credentials in .env");
  }

  return {
    consumerKey: process.env.TWITTER_CONSUMER_KEY!,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET!,
    callbackURL: process.env.TWITTER_CALLBACK_URL!,
  };
};

passport.use(
  new TwitterStrategy(getCredentials(), (_, __, profile, done) =>
    done(null, profile),
  ),
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: Express.User, done) => done(null, user));
