import { Button } from "@repo/ui";
import { Link } from "react-router-dom";

/** Error page for route errors*/
export default function ErrorPage() {
  //const error = useRouteError() as ErrorResponse & Error;

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div id="error-page" className="text-center">
        <h1>Oops!</h1>
        <p>{"This page doesn't seem to exist"}</p>
        <Link to="/">
          <Button className="mt-4" variant="secondary" size="sm">
            Head back
          </Button>
        </Link>
      </div>
    </div>
  );
}
