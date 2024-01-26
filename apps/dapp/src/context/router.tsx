import {
  createHashRouter,
  RouterProvider as ReactRouterProvider,
} from "react-router-dom";
import ErrorPage from "../pages/error-page";
import AuctionPage from "../pages/auction-page";
import { AuctionList } from "../modules/auction/auction-list";

const router: ReturnType<typeof createHashRouter> = createHashRouter([
  { path: "/", element: <AuctionList />, errorElement: <ErrorPage /> },
  { path: "/auction/:chainId/:id", element: <AuctionPage /> },
]);

export default function RouterProvider() {
  return <ReactRouterProvider router={router} />;
}

export { RouterProvider };
