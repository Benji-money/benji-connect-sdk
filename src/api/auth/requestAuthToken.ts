import { Endpoints } from "../../config";
import { getAuth } from "../../lib/auth";
import { jsonPost } from "./client";

type RequestAuthTokenResponse = {
  data?: {
    token?: any;
  };
};

export async function requestAuthToken(): Promise<string> {

  const { authPayload } = getAuth();
  const baseUrl = Endpoints.benji_connect_auth_service_url;
  const path = '/verify/token/create';
  const body = authPayload;

  const json = await jsonPost<RequestAuthTokenResponse>({
    baseUrl: baseUrl,
    path: path,
    body: body,
  });

  const token = json?.data?.token;

  if (!token) {
    throw new Error(
      '[BenjiConnect SDK] Missing data.token in verify/token/create response'
    );
  }

  return token;
}