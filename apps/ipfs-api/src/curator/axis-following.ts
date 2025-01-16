import * as dotenv from "dotenv";
import type { RapidTwitterApiResponse } from "./types";

dotenv.config();

if (process.env.TWITTER_RAPID_API_KEY == null) {
  throw Error("process.env.TWITTER_RAPID_API_KEY is not set");
}

const rapidTwitterApiKey = process.env.TWITTER_RAPID_API_KEY;

const fetchAxisFollowing = async (): Promise<string[]> => {
  const url =
    "https://twttrapi.p.rapidapi.com/user-following?username=axis_fi&count=20";
  const headers = {
    "x-rapidapi-host": "twttrapi.p.rapidapi.com",
    "x-rapidapi-key": rapidTwitterApiKey,
  };

  const response = await fetch(url, { method: "GET", headers });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data: RapidTwitterApiResponse = await response.json();

  return (
    data?.data?.user?.timeline_response?.timeline?.instructions
      ?.find((i) => i.__typename === "TimelineAddEntries")
      ?.entries?.map((e) => e?.content?.content?.userResult?.result)
      ?.filter((user) => user?.rest_id)
      ?.map((user) => user.rest_id) || []
  );
};

let followingCache: string[];
let lastFetchTime = 0;
const CACHE_TTL = 1 * 60 * 60 * 1000; // 1 hour

const getAxisFollowing = async () => {
  try {
    // Use cached following if available and not expired
    const now = Date.now();

    if (followingCache && now - lastFetchTime < CACHE_TTL) {
      return followingCache;
    }

    followingCache = await fetchAxisFollowing();
    lastFetchTime = now;
    return followingCache;
  } catch (error: unknown) {
    console.error("Error getting Twitter following:", error);
    return [];
  }
};

export { getAxisFollowing };
