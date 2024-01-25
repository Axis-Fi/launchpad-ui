import { createHashRouter } from "react-router-dom";
import App from "../App";
import ErrorPage from "../pages/ErrorPage";

const router: ReturnType<typeof createHashRouter> = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
]);

export { router };
