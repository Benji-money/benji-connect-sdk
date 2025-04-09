interface ConnectSDKConfig {
    authServiceUrl?: string;
    authUrl?: string;
    bearerToken: string;
    onSuccess: (token: string, metadata: any) => void;
    onExit: () => void;
    onEvent: (event: { type: string, data: any }) => void;
    token?: string;
}

interface ConnectSDKParams {
    userExternalId?: string;
    mode?: number;
    partnerId?: string;
    merchantId?: string;
    displayName: string;
    partnershipId?: string;
}

declare class ConnectSDK {
    constructor(config: ConnectSDKConfig);
    getAuthToken(params: ConnectSDKParams): Promise<string>;
    initialize(params: ConnectSDKParams): Promise<void>;
    openWithParams(params: ConnectSDKParams): Promise<void>;
    open(): void;
    close(): void;
    cleanup(): void;
    private handleMessage(event: MessageEvent): void;
}

export default ConnectSDK;