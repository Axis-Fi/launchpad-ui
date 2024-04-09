import {
  createHashRouter,
  RouterProvider as ReactRouterProvider,
} from "react-router-dom";
import ErrorPage from "../pages/error-page";
import AuctionPage from "../pages/auction-page";
import Dashboard from "pages/dashboard";
import App from "src/App";
import CreateAuctionPage from "pages/create-auction-page";
import AuctionListPage from "pages/auction-list-page";
import { CuratorPage } from "pages/curator-page";
import { FaucetPage } from "pages/faucet-page";

const router: ReturnType<typeof createHashRouter> = createHashRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <AuctionListPage /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/auction/:chainId/:lotId", element: <AuctionPage /> },
      { path: "/auctions", element: <AuctionListPage /> },
      { path: "/create/auction", element: <CreateAuctionPage /> },
      { path: "/curator", element: <CuratorPage /> },
      { path: "/faucet", element: <FaucetPage /> },
    ],
  },
]);

export default function RouterProvider() {
  return <ReactRouterProvider router={router} />;
}

export { RouterProvider };
