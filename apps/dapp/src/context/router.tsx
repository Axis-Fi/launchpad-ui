import {
  createHashRouter,
  RouterProvider as ReactRouterProvider,
} from "react-router-dom";
import ErrorPage from "../pages/error-page";
import AuctionPage from "../pages/auction-page";
import App from "src/App";
import CreateAuctionPage from "pages/create-auction-page";
import AuctionListPage from "pages/auction-list-page";
import { CuratorPage } from "pages/curator-page";
import { FaucetPage } from "pages/faucet-page";
import { DeployTokenPage } from "pages/deploy-token-page";
import CuratorListPage from "pages/curator-list-page";
import { ProfilePage } from "pages/points/profile-page";
import { LeaderboardPage } from "pages/points/leaderboard-page";
import { ClaimPointsPage } from "pages/points/claim-points-page";
import { SignInPage } from "pages/points/sign-in-page";
import { BridgePage } from "pages/bridge-page";
import { AuctionRegistering } from "modules/auction/status/auction-registering";
import { CuratorDedicatedPage } from "pages/curator-dedicated-page";
import { CuratorProfilePage } from "modules/curator/curator-profile-page";
import { CuratorAuthentication } from "modules/curator/curator-authentication";

const router: ReturnType<typeof createHashRouter> = createHashRouter([
  {
    path: "/*",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "", element: <AuctionListPage /> },
      { path: "points/*", element: <ProfilePage /> },
      { path: "points/sign-in", element: <SignInPage /> },
      { path: "points/claim", element: <ClaimPointsPage /> },
      { path: "profile/*", element: <ProfilePage /> },
      { path: "leaderboard", element: <LeaderboardPage /> },
      { path: "auctions", element: <AuctionListPage /> },
      { path: "create/auction", element: <CreateAuctionPage /> },
      { path: "curator", element: <CuratorPage /> },
      { path: "curators", element: <CuratorListPage /> },
      { path: "faucet", element: <FaucetPage /> },
      { path: "deploy", element: <DeployTokenPage /> },
      { path: ":chainId/:lotId/register", element: <AuctionRegistering /> },
      { path: ":chainId/:lotId", element: <AuctionPage /> },
      { path: "bridge", element: <BridgePage /> },
      { path: ":curatorId/bridge", element: <BridgePage /> },
      {
        path: "curator/:curatorId",
        element: <CuratorDedicatedPage />,
      },
      {
        path: ":curatorId/:chainId/:lotId",
        element: <AuctionPage />,
      },
      {
        path: "curator-authenticate",
        element: <CuratorAuthentication />,
      },
      {
        path: "curator-verified",
        element: <CuratorProfilePage />,
      },
    ],
  },
]);

export default function RouterProvider() {
  return <ReactRouterProvider router={router} />;
}

export { RouterProvider };
