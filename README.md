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
  environment: "production", // or "sandbox" | "development",
  bearerToken: "your-bearer-token",

  // token: string, metadata: BenjiConnectOnSuccessMetadata
  onSuccess: (token, metadata) => {
    console.log("Connect flow completed successfully", token, metadata);
  },

  // error: Error, error_id: string, metadata: BenjiConnectMetadata
  onError: (error, error_id, metadata) => {
    console.log("Connect error", error, error_id, metadata);
  },

  // metadata: BenjiConnectOnExitMetadata
  onExit: (metadata) => {
    console.log("Connect flow exit", metadata);
  },

  // type: BenjiConnectEventType, metadata: BenjiConnectMetadata
  onEvent: (type, metadata) => {
    console.log("Connect flow event", type, metadata);
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
    environment: "production", // or "sandbox" | "development",
    bearerToken: "your-bearer-token",

    onSuccess: (token, metadata) => {
      console.log("Connect flow completed successfully", token, metadata);
    },

    onError: (error, error_id, metadata) => {
      console.log("Connect error", error, error_id, metadata);
    },

    onExit: (metadata) => {
      console.log("Connect flow exit", metadata);
    },

    onEvent: (type, metadata) => {
      console.log("Connect flow event", type, metadata);
    },
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
- `onSuccess` (optional): Callback function called when connect completed successfully
- `onError` (optional): Callback function called when error occurs in the connect flow
- `onExit` (optional): Callback function called when the user exits the connect flow
- `onEvent` (optional): Callback function for handling various events

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build
```

## License

Private - All rights reserved
