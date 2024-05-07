import { Button } from "@repo/ui";
import { environment } from "@repo/env";
import { ReachOutMessage } from "modules/app/reach-out";
import { ErrorResponse, Link, useRouteError } from "react-router-dom";

const showError = environment.isDevelopment;

/** Error boundary to inform users */
export default function ErrorPage() {
  const error = useRouteError() as ErrorResponse & Error & { error?: Error };

  const name = error?.error?.name ?? error?.name;
  const message = error?.error?.message ?? error?.message;

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div id="error-page" className="text-center">
        <h1>Oops!</h1>
        {showError ? (
          <p>
            {name} {message}
          </p>
        ) : (
          <>
            <p className="mt-2">{"Something has gone wrong..."}</p>
            <ReachOutMessage />
          </>
        )}
        <Link to="/">
          <Button className="mt-4" variant="secondary" size="sm">
            Head back
          </Button>
        </Link>
      </div>
    </div>
  );
}
