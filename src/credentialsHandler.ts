import * as AWS from 'aws-sdk';
import * as localForage from 'localforage';
import { AWS_CLIENT_ID, LF_CREDENTIALS } from './definitions';
import { Credentials, UserInfo } from './frontend/table/lib';
const Cognito = new AWS.CognitoIdentityServiceProvider({ region: 'eu-west-1' });

export class CredentialsError extends Error {
  constructor() {
    super('An error occurred. Please log out and log back in');
    this.name = 'CredentialsError';
  }
}

export async function login(email: string, password: string) {
  const response = await Cognito.initiateAuth({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: AWS_CLIENT_ID,
    AuthParameters: { USERNAME: email.replaceAll(' ', ''), PASSWORD: password },
  }).promise();

  if (!response.AuthenticationResult) {
    throw new Error('An unexpected error occurred');
  }

  await localForage.setItem(LF_CREDENTIALS, {
    ...response.AuthenticationResult,
    ExpirationTimestamp: Math.round(
      new Date().getTime() / 1000 + response.AuthenticationResult.ExpiresIn!
    ),
  });
}

export async function getUserInfo(): Promise<UserInfo> {
  const response = await Cognito.getUser({
    AccessToken: await getAccessToken(),
  }).promise();

  return {
    email: response.UserAttributes.find((a) => a.Name === 'email')?.Value || '',
    firstname: response.UserAttributes.find((a) => a.Name === 'custom:firstname')?.Value || '',
    lastname: response.UserAttributes.find((a) => a.Name === 'custom:lastname')?.Value || '',
  };
}

export async function getAccessToken() {
  let credentials: Credentials | null;

  try {
    credentials = await localForage.getItem(LF_CREDENTIALS);
  } catch {
    throw new Error('An unexpected error occurred');
  }

  if (!credentials) {
    throw new CredentialsError();
  }

  if (isAccessTokenOld(credentials)) {
    try {
      credentials = await refreshCredentials(credentials.RefreshToken!);
      await localForage.setItem(LF_CREDENTIALS, credentials);
    } catch (error) {
      console.log(error);
      throw new CredentialsError();
    }
  }

  return credentials.AccessToken + '';
}

export async function refreshCredentials(refreshToken: string): Promise<Credentials> {
  const response = await Cognito.initiateAuth({
    AuthFlow: 'REFRESH_TOKEN',
    ClientId: AWS_CLIENT_ID,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  }).promise();

  if (!response.AuthenticationResult) {
    throw new Error('An unexpected error occurred');
  }

  return {
    ...response.AuthenticationResult,
    RefreshToken: refreshToken,
    ExpirationTimestamp: Math.round(
      new Date().getTime() / 1000 + response.AuthenticationResult.ExpiresIn!
    ),
  };
}

export function isAccessTokenOld(credentials: Credentials) {
  return credentials.ExpirationTimestamp - new Date().getTime() / 1000 < 300;
}

export async function clearCredentials() {
  await localForage.setItem(LF_CREDENTIALS, '');
}
