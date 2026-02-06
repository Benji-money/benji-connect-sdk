# Benji Connect Web SDK

A JavaScript Github Package SDK for integrating Benji Connect, Benji's authentication and verification services.

## Installation

```bash
# If you're using npm
npm install @benji-money/connect-sdk

# If you're using yarn
yarn add @benji-money/connect-sdk
```

## Usage

### ESM + CJS

```typescript
import { ConnectSDK } from "@benji-money/connect-sdk";

const sdk = new ConnectSDK({
  environment: "production", // or "sandbox" | "development",
  token: "your-connect-token",

  // token: string, metadata: BenjiConnectOnSuccessMetadata
  onSuccess: (token, metadata) => {
    console.log("✅ Benji Connect onSuccess");
  },

  // error: Error, error_id: string, metadata: BenjiConnectMetadata
  onError: (error, error_id, metadata) => {
    console.log("🛑 Benji Connect onError");
  },

  // metadata: BenjiConnectOnExitMetadata
  onExit: (metadata) => {
    console.log("🚪 Benji Connect onExit");
  },

  // type: BenjiConnectEventType, metadata: BenjiConnectMetadata
  onEvent: (type, metadata) => {
    console.log("📨 Benji Connect onEvent \(type)");
  },
});

// Open the authentication flow UI
sdk.open();
```
Demo example [here](https://github.com/Benji-money/benji-connect-examples/tree/main/web/esm).

### UMD (Script Tag)

```javascript
<script src="/path/to/connect-sdk.umd.js"></script>
<script>
  const sdk = new ConnectSDK({
    environment: "production", // or "sandbox" | "development",
    token: "your-connect-token",

    onSuccess: (token, metadata) => {
      console.log("✅ Benji Connect onSuccess");
    },

    onError: (error, error_id, metadata) => {
      console.log("🛑 Benji Connect onError");
    },

    onExit: (metadata) => {
      console.log("🚪 Benji Connect onExit");
    },

    onEvent: (type, metadata) => {
      console.log("📨 Benji Connect onEvent", type);
    },
  });

  sdk.open();
</script>
```

## Configuration

The SDK accepts the following configuration options:

- `token` (required): Your API connect token
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

License

This SDK is proprietary software provided by Benji Money.

You are welcome to use it to integrate with Benji services, but modification,
redistribution, or use outside of Benji’s platform is not permitted.

See the [LICENSE](./LICENSE) file for full terms and usage details.
