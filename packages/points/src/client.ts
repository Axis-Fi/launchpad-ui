import { pointsServers } from "@repo/env";
import { AuthenticationApi, Configuration, PointsApi } from ".";
import { environment } from "@repo/env";
import { Config, signMessage } from "@wagmi/core";

// JWT Token Storage
export const TokenStorage = {
  getAccessToken: () => sessionStorage.getItem("points_access_token"),
  getRefreshToken: () => sessionStorage.getItem("points_refresh_token"),
  setAccessToken: (token: string) =>
    sessionStorage.setItem("points_access_token", token),
  setRefreshToken: (token: string) =>
    sessionStorage.setItem("points_refresh_token", token),
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
  domain: window.location.host,
  uri: window.location.origin,
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
  wagmiConfig: Config;

  constructor(config: Configuration = defaultConfig, wagmiConfig: Config) {
    this.authApi = new AuthenticationApi(config);
    this.pointsApi = new PointsApi(config);
    this.wagmiConfig = wagmiConfig;
  }

  private headers() {
    const accessToken = TokenStorage.getAccessToken();
    if (accessToken) {
      return { Authorization: `Bearer ${accessToken}` };
    }
  }

  // Authentication
  private async sign(
    chainId: number,
    address: `0x{string}`,
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

  async signIn(chainId: number, address: `0x{string}`) {
    try {
      const statement = "Sign in to view your Axis points.";
      const { message, signature } = await this.sign(
        chainId,
        address,
        statement,
      );

      return this.authApi.signInPost({ signinData: { message, signature } });
    } catch (e) {
      console.error(`Failed to sign in`, e);
    }
  }

  async register(chainId: number, address: `0x{string}`) {
    try {
      const statement = "Register to claim your Axis points.";
      const { message, signature } = await this.sign(
        chainId,
        address,
        statement,
      );

      return this.authApi.registerPost(
        { registrationData: { message, signature } },
        { headers: this.headers() },
      );
    } catch (e) {
      console.error(`Failed to register`, e);
    }
  }

  async linkWallet(chainId: number, address: `0x{string}`) {
    try {
      const statement = "Link wallet to your Axis points account.";
      const { message, signature } = await this.sign(
        chainId,
        address,
        statement,
      );

      return this.authApi.linkPost(
        { signinData: { message, signature } },
        { headers: this.headers() },
      );
    } catch (e) {
      console.error(`Failed to link wallet`, e);
    }
  }

  async signOut() {
    // Clear tokens
    TokenStorage.setAccessToken("");
    TokenStorage.setRefreshToken("");
  }
}

export const createPointsClient = (config?: Configuration) =>
  new PointsClient(config);

export const pointsClient = new PointsClient();
