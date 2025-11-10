import { BenjiConnectUserData } from "../types/user";

export function extractUserData(
  input: BenjiConnectUserData | null | undefined
): BenjiConnectUserData | undefined {
  if (!input) return undefined;

  if ("user" in (input as any) && "status" in (input as any)) {
    return input as BenjiConnectUserData;
  }
;
  return undefined;
}