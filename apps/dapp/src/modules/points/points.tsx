import { Button } from "@/components";
import { Register } from "./register";
// import { SignIn } from "./sign-in";
import { useState } from "react";
import { LinkWallet } from "./link-wallet";
import { cn } from "@/utils";

export function Points() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const userNeedsToRegister = !isSignedIn && !isRegistered;
  // const userNeedsToSignIn = !isSignedIn && isRegistered;
  const userNeedsToLinkWallet = isSignedIn && !isRegistered;

  return (
    <div className="flex min-h-screen flex-col items-center">
      <h1 className="text-2xl font-bold">225 points</h1>

      <div className="mt-20 grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
        <div className="flex flex-col items-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-md bg-gray-800">
            <span className="text-gray-400">Image</span>
          </div>
          <h2 className="font-regular text-xl">Bidding Points</h2>
          <p className="text-2xl font-bold">100</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-md bg-gray-800">
            <span className="text-gray-400">Image</span>
          </div>
          <h2 className="font-regular text-xl">Referral Points</h2>
          <p className="text-2xl font-bold">75</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-md bg-gray-800">
            <span className="text-gray-400">Image</span>
          </div>
          <h2 className="font-regular text-xl">Ecosystem Points</h2>
          <p className="text-2xl font-bold">50</p>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        {userNeedsToRegister && <Register />}
        {/* {userNeedsToSignIn && <SignIn />} */}
        {userNeedsToLinkWallet && <LinkWallet />}
      </div>

      <div className="mt-10 flex flex-col space-y-4 border p-4">
        <h5 className="text-center">DEVELOPER CONTROLS</h5>
        <Button
          size="sm"
          variant="secondary"
          className={cn(
            isRegistered && "bg-green-500",
            !isRegistered && "bg-red-400",
          )}
          onClick={() => setIsRegistered((toggle) => !toggle)}
        >
          Toggle registered (current: {isRegistered ? "on" : "off"})
        </Button>
        <Button
          size="sm"
          variant="secondary"
          className={cn(
            isSignedIn && "bg-green-500",
            !isSignedIn && "bg-red-400",
          )}
          onClick={() => setIsSignedIn((toggle) => !toggle)}
        >
          Toggle signed-in (current: {isSignedIn ? "on" : "off"})
        </Button>
      </div>
    </div>
  );
}
