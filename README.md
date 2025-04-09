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

```javascript
import ConnectSDK from "@benji-money/connect-sdk";

const sdk = new ConnectSDK({
  bearerToken: "your-bearer-token",
  onSuccess: (token, metadata) => {
    console.log("Authentication successful", token, metadata);
  },
  onExit: () => {
    console.log("User exited the authentication flow");
  },
  onEvent: (event) => {
    console.log("Event received", event);
  },
});

// Open the authentication flow
sdk.openWithParams({
  displayName: "User Name",
  partnerId: "partner-id",
  merchantId: "merchant-id",
});
```

## Configuration

The SDK accepts the following configuration options:

- `bearerToken` (required): Your API bearer token
- `onSuccess` (required): Callback function called when authentication is successful
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
