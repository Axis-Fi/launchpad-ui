import { zeroAddress } from "viem";
import { pointsServers } from "@repo/env";
import {
  AuthenticationApi,
  Configuration,
  PointsApi,
  Middleware,
  ResponseContext,
  LaunchesApi,
  LaunchRegistration,
} from ".";
import { environment } from "@repo/env";
import { Config, signMessage } from "@wagmi/core";

// JWT Token Storage
export const TokenStorage = {
  getAccessToken: () => localStorage.getItem("points_access_token"),
  getRefreshToken: () => localStorage.getItem("points_refresh_token"),
  setAccessToken: (token: string) =>
    localStorage.setItem("points_access_token", token),
  setRefreshToken: (token: string) =>
    localStorage.setItem("points_refresh_token", token),
};

// SIWE Message Formatting
function createSIWEMessage(message: {
  address: string;
  domain: string;
  uri: string;
  version: string;
  nonce: string;
  chainId: string | number;
  statement: string;
}) {
  const domain = `${message.domain} wants you to sign in with your Ethereum account:\n${message.address}`;

  const statement = message.statement;

  const URI = `URI: ${message.uri}`;
  const version = `Version: ${message.version}`;
  const chainId = `Chain ID: ${message.chainId}`;
  const nonce = `Nonce: ${message.nonce}`;
  const issuedAt = `Issued At: ${new Date().toISOString()}`;

  const content = [URI, version, chainId, nonce, issuedAt].join("\n");
  return [domain, statement, content].join("\n\n");
}

const basicMessage = {
  domain: environment.isDevelopment
    ? "axis-testnet.eth.limo" // locally we use the testnet environemnt points service
    : window.location.host,
  uri: environment.isDevelopment
    ? "https://axis-testnet.eth.limo"
    : window.location.origin,
  version: "1",
};

// Client setup
const { url: serverUrl } =
  pointsServers[environment.current] ?? pointsServers.testing;

const defaultConfig = new Configuration({
  basePath: serverUrl,
});

// API Client
export class PointsClient {
  authApi: AuthenticationApi;
  pointsApi: PointsApi;
  launchesApi: LaunchesApi;
  wagmiConfig: Config;

  constructor(config: Configuration = defaultConfig, wagmiConfig: Config) {
    const authMiddleware: Middleware = {
      post: this.refreshTokenInterceptor.bind(this),
    };
    const fullConfig = new Configuration({
      ...config,
      middleware: [authMiddleware],
    });

    this.authApi = new AuthenticationApi(fullConfig);
    this.pointsApi = new PointsApi(fullConfig);
    this.launchesApi = new LaunchesApi(fullConfig);
    this.wagmiConfig = wagmiConfig;
  }

  private headers() {
    const accessToken = TokenStorage.getAccessToken();
    if (accessToken) {
      return {
        Authorization: `Bearer ${accessToken}`,
      };
    }
  }

  // Authentication
  private async sign(
    chainId: number,
    address: `0x${string}`,
    statement: string,
  ) {
    const nonce = await this.authApi.nonceGet();

    const message = createSIWEMessage({
      ...basicMessage,
      statement,
      address,
      chainId,
      nonce,
    });

    const signature = await signMessage(this.wagmiConfig, {
      account: address,
      message,
    });

    return { message, signature };
  }

  async isRegistered(address: `0x${string}`) {
    return this.authApi.isRegisteredWalletAddressGet({
      walletAddress: address,
    });
  }

  async isUsernameAvailable(username: string) {
    return this.authApi.availableUsernameGet({ username });
  }

  async signIn(chainId: number, address: `0x${string}`) {
    const statement = "Sign in to view your Axis points.";
    const { message, signature } = await this.sign(chainId, address, statement);

    return this.authApi.signInPost({ signinData: { message, signature } });
  }

  async register(
    chainId: number,
    address: `0x${string}`,
    username: string,
    referrer?: string,
    avatar?: Blob,
  ) {
    const statement = "Register to claim your Axis points.";
    const { message, signature } = await this.sign(chainId, address, statement);

    const response = await this.authApi.registerPost(
      {
        data: {
          message,
          signature,
          username,
          referrer: referrer ?? zeroAddress,
        },
        profileImage: avatar ?? undefined,
      },
      { headers: this.headers() },
    );

    return response;
  }

  async linkWallet(chainId: number, address: `0x${string}`) {
    const statement = "Link wallet to your Axis points account.";
    const { message, signature } = await this.sign(chainId, address, statement);

    const headers = {
      ...this.headers(),
      "Content-Type": "application/json",
    };

    return this.authApi.linkPost(
      { signinData: { message, signature } },
      { headers },
    );
  }

  signOut() {
    // Clear tokens
    TokenStorage.setAccessToken("");
    TokenStorage.setRefreshToken("");
  }

  //Error interceptor that attempts to refresh a JWT token
  async refreshTokenInterceptor(responseContext: ResponseContext) {
    const url = responseContext.url;
    const init = responseContext.init;

    // Handle the case where the refresh token itself has expired (force user to sign in again)
    if (url.endsWith("/refresh") && responseContext.response?.status === 400) {
      this.signOut();
      window.location.href = "#/points/sign-in";
      return;
    }

    if (
      url !== "/sign-in" &&
      url !== "/refresh" &&
      responseContext.response?.status === 401
    ) {
      const refreshToken = TokenStorage.getRefreshToken();

      if (refreshToken) {
        try {
          const response = await this.authApi.refreshPost({
            body: refreshToken,
          });

          TokenStorage.setAccessToken(response.accessToken!);
          TokenStorage.setRefreshToken(response.refreshToken!);

          const newInit = {
            ...init,
            headers: {
              ...init.headers,
              Authorization: `Bearer ${response.accessToken}`,
            },
          };

          return responseContext.fetch(url, newInit);
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }
  }

  // Points

  async getWalletPoints(address: `0x${string}`) {
    return this.pointsApi.pointsWalletAddressGet({ walletAddress: address });
  }

  async getLeaderboard() {
    return this.pointsApi.leaderboardGet();
  }

  async getRecentJoins() {
    return this.pointsApi.recentJoinsGet();
  }

  async getUserProfile() {
    return this.pointsApi.profileGet({ headers: this.headers() });
  }

  async setUserProfile(username?: string, avatar?: Blob) {
    return this.pointsApi.profilePost(
      {
        data: {
          username: username ? username : undefined,
        },
        profileImage: avatar ? avatar : undefined,
      },
      { headers: this.headers() },
    );
  }

  async getActiveRegistrationLaunches() {
    return this.launchesApi.launchesActiveGet();
  }

  async getUserRegistrations() {
    return this.launchesApi.launchesRegistrationsGet();
  }

  async registerUserDemand(launchRegistration: LaunchRegistration) {
    return this.launchesApi.launchesRegisterPost({ launchRegistration });
  }

  async updateUserDemand(launchRegistration: LaunchRegistration) {
    return this.launchesApi.launchesRegisterUpdatePost({ launchRegistration });
  }

  async cancelUserDemand(launchRegistration: LaunchRegistration) {
    return this.launchesApi.launchesRegisterCancelPost({
      launchRegistration,
    });
  }
}

export const createPointsClient = (
  wagmiConfig: Config,
  config?: Configuration,
) => new PointsClient(config, wagmiConfig);
