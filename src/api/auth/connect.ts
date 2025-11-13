import { BenjiConnectTokenData } from "../../types/connect";
import { Endpoints } from "../../config";
import { jsonGet } from "../client";

type GetConnectTokenDataResponse = {
  data: BenjiConnectTokenData;
};

export async function getConnectTokenData(token: string): Promise<BenjiConnectTokenData> {

  const baseUrl = Endpoints.benji_connect_auth_service_url;
  const path = `/connect/token/${token}`;

  const json = await jsonGet<GetConnectTokenDataResponse>({
    baseUrl: baseUrl,
    path: path
  });

  const connectTokenData: BenjiConnectTokenData = json?.data;

  if (!connectTokenData) {
    throw new Error(
      '[BenjiConnect SDK] Missing data.token in /connect/token response'
    );
  }

  return connectTokenData;
}