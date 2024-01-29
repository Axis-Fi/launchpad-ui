import {
  createHashRouter,
  RouterProvider as ReactRouterProvider,
} from "react-router-dom";
import ErrorPage from "../pages/error-page";
import AuctionPage from "../pages/auction-page";
import Dashboard from "pages/dashboard";
import { AuctionList } from "../modules/auction/auction-list";
import App from "src/App";
import CreateAuctionPage from "pages/create-auction-page";

const router: ReturnType<typeof createHashRouter> = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/auction/:chainId/:id", element: <AuctionPage /> },
      { path: "/auctions", element: <AuctionList /> },
      { path: "/create/auction", element: <CreateAuctionPage /> },
    ],
  },
]);

export default function RouterProvider() {
  return <ReactRouterProvider router={router} />;
}

export { RouterProvider };
