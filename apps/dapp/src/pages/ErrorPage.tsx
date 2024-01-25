import { useRouteError, ErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError() as ErrorResponse & Error;

  return (
    <div className="w-screen h-screen flex flex-col justify-center">
      <div id="error-page" className="text-center">
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error?.statusText || error?.message}</i>
        </p>
      </div>
    </div>
  );
}
