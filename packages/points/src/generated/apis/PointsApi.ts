/* tslint:disable */
/* eslint-disable */
/**
 * Axis Points Server
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import * as runtime from "../runtime";
import type {
  ProfileData,
  UserPhaseProfile,
  UserProfile,
  UserProfileWithWallets,
  WalletPoints,
} from "../models/index";
import {
  ProfileDataFromJSON,
  ProfileDataToJSON,
  UserPhaseProfileFromJSON,
  UserPhaseProfileToJSON,
  UserProfileFromJSON,
  UserProfileToJSON,
  UserProfileWithWalletsFromJSON,
  UserProfileWithWalletsToJSON,
  WalletPointsFromJSON,
  WalletPointsToJSON,
} from "../models/index";

export interface LeaderboardPhaseGetRequest {
  phase: number;
}

export interface PointsWalletAddressGetRequest {
  walletAddress: string;
}

export interface ProfilePostRequest {
  profileData: ProfileData;
}

/**
 *
 */
export class PointsApi extends runtime.BaseAPI {
  /**
   * Retrieves the overall points leaderboard.
   */
  async leaderboardGetRaw(
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<Array<UserProfile>>> {
    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    const response = await this.request(
      {
        path: `/leaderboard`,
        method: "GET",
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      jsonValue.map(UserProfileFromJSON),
    );
  }

  /**
   * Retrieves the overall points leaderboard.
   */
  async leaderboardGet(
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<Array<UserProfile>> {
    const response = await this.leaderboardGetRaw(initOverrides);
    return await response.value();
  }

  /**
   * Retrieves the leaderboard for a specific phase.
   */
  async leaderboardPhaseGetRaw(
    requestParameters: LeaderboardPhaseGetRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<Array<UserPhaseProfile>>> {
    if (
      requestParameters.phase === null ||
      requestParameters.phase === undefined
    ) {
      throw new runtime.RequiredError(
        "phase",
        "Required parameter requestParameters.phase was null or undefined when calling leaderboardPhaseGet.",
      );
    }

    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    const response = await this.request(
      {
        path: `/leaderboard/{phase}`.replace(
          `{${"phase"}}`,
          encodeURIComponent(String(requestParameters.phase)),
        ),
        method: "GET",
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      jsonValue.map(UserPhaseProfileFromJSON),
    );
  }

  /**
   * Retrieves the leaderboard for a specific phase.
   */
  async leaderboardPhaseGet(
    requestParameters: LeaderboardPhaseGetRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<Array<UserPhaseProfile>> {
    const response = await this.leaderboardPhaseGetRaw(
      requestParameters,
      initOverrides,
    );
    return await response.value();
  }

  /**
   * Retrieves the points information for a wallet address.
   */
  async pointsWalletAddressGetRaw(
    requestParameters: PointsWalletAddressGetRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<WalletPoints>> {
    if (
      requestParameters.walletAddress === null ||
      requestParameters.walletAddress === undefined
    ) {
      throw new runtime.RequiredError(
        "walletAddress",
        "Required parameter requestParameters.walletAddress was null or undefined when calling pointsWalletAddressGet.",
      );
    }

    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    const response = await this.request(
      {
        path: `/points/{wallet_address}`.replace(
          `{${"wallet_address"}}`,
          encodeURIComponent(String(requestParameters.walletAddress)),
        ),
        method: "GET",
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      WalletPointsFromJSON(jsonValue),
    );
  }

  /**
   * Retrieves the points information for a wallet address.
   */
  async pointsWalletAddressGet(
    requestParameters: PointsWalletAddressGetRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<WalletPoints> {
    const response = await this.pointsWalletAddressGetRaw(
      requestParameters,
      initOverrides,
    );
    return await response.value();
  }

  /**
   * Retrieves the user\'s profile information, including points by category and total.
   */
  async profileGetRaw(
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<UserProfileWithWallets>> {
    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    if (this.configuration && this.configuration.accessToken) {
      const token = this.configuration.accessToken;
      const tokenString = await token("JWTAuthorization", []);

      if (tokenString) {
        headerParameters["Authorization"] = `Bearer ${tokenString}`;
      }
    }
    const response = await this.request(
      {
        path: `/profile`,
        method: "GET",
        headers: headerParameters,
        query: queryParameters,
      },
      initOverrides,
    );

    return new runtime.JSONApiResponse(response, (jsonValue) =>
      UserProfileWithWalletsFromJSON(jsonValue),
    );
  }

  /**
   * Retrieves the user\'s profile information, including points by category and total.
   */
  async profileGet(
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<UserProfileWithWallets> {
    const response = await this.profileGetRaw(initOverrides);
    return await response.value();
  }

  /**
   * Updates the user\'s profile information.
   */
  async profilePostRaw(
    requestParameters: ProfilePostRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<runtime.ApiResponse<void>> {
    if (
      requestParameters.profileData === null ||
      requestParameters.profileData === undefined
    ) {
      throw new runtime.RequiredError(
        "profileData",
        "Required parameter requestParameters.profileData was null or undefined when calling profilePost.",
      );
    }

    const queryParameters: any = {};

    const headerParameters: runtime.HTTPHeaders = {};

    headerParameters["Content-Type"] = "application/json";

    if (this.configuration && this.configuration.accessToken) {
      const token = this.configuration.accessToken;
      const tokenString = await token("JWTAuthorization", []);

      if (tokenString) {
        headerParameters["Authorization"] = `Bearer ${tokenString}`;
      }
    }
    const response = await this.request(
      {
        path: `/profile`,
        method: "POST",
        headers: headerParameters,
        query: queryParameters,
        body: ProfileDataToJSON(requestParameters.profileData),
      },
      initOverrides,
    );

    return new runtime.VoidApiResponse(response);
  }

  /**
   * Updates the user\'s profile information.
   */
  async profilePost(
    requestParameters: ProfilePostRequest,
    initOverrides?: RequestInit | runtime.InitOverrideFunction,
  ): Promise<void> {
    await this.profilePostRaw(requestParameters, initOverrides);
  }
}
