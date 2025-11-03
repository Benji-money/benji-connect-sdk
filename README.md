# Benji Connect SDK

A JavaScript SDK for integrating Benji's authentication and verification services.

## Installation

```bash
# If you're using npm
npm install @benji-money/connect-sdk

# If you're using yarn
yarn add @benji-money/connect-sdk
```

## Usage

### ESM + CJS

```javascript
import ConnectSDK from "@benji-money/connect-sdk";

const sdk = new ConnectSDK({
  env: "production", // or "sandbox" | "development",
  bearerToken: "your-bearer-token",
  onSuccess: (data: BenjiConnectOnSuccessData)  => {
    console.log("Authentication success", data);
  },
  onError: (data: BenjiConnectOnErrorData) => {
    console.log("Authentication error", data);
  }
  onExit: (data: BenjiConnectOnExitData) => {
    console.log("Authentication exit", data);
  },
  onEvent: (data: BenjiConnectOnEventData) => {
    console.log("Authentication event", data);
  },
});

// Open the authentication flow
sdk.openWithParams({
  displayName: "User Name",
  partnerId: "partner-id",
  merchantId: "merchant-id",
});
```

### UMD (Script Tag)

```javascript
<script src="/path/to/connect-sdk.umd.js"></script>
<script>
  const sdk = new ConnectSDK({
    env: "production", // or "sandbox" | "development",
    bearerToken: "your-bearer-token",
    onSuccess: (data: BenjiConnectOnSuccessData)  => console.log("Authentication success", data),
    onError: (data: BenjiConnectOnErrorData) => console.log("Authentication error", data),
    onExit: (data: BenjiConnectOnExitData) => console.log("Authentication exit", data),
    onEvent: (data: BenjiConnectOnEventData) => console.log("Authentication event", data),
  });

  sdk.openWithParams({
    displayName: "User Name",
    partnerId: "partner-id",
    merchantId: "merchant-id",
  });
</script>
```

## Configuration

The SDK accepts the following configuration options:

- `bearerToken` (required): Your API bearer token
- `onSuccess` (required): Callback function called when authentication is successful
- `onError` (required): Callback function called when error occurs in the authentication flow
- `onExit` (required): Callback function called when the user exits the flow
- `onEvent` (required): Callback function for handling various events
- `authServiceUrl` (optional): Override the default auth service URL
- `authUrl` (optional): Override the default auth URL

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build
```

## License

Private - All rights reserved
