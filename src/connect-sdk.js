class ConnectSDK {
    constructor(config) {
      this.config = {
        authServiceUrl: 'https://authservice-staging.withbenji.com',
        authUrl: 'https://verifyapp-staging.withbenji.com',
        ...config
      };
      this.iframe = null;
      this.iframeContainer = null;
      if (!this.config.bearerToken) {
        throw new Error('Bearer token is required in the configuration');
      }
      if (typeof this.config.onSuccess !== 'function') {
        throw new Error('onSuccess callback is required in the configuration');
      }
      if (typeof this.config.onExit !== 'function') {
        throw new Error('onExit callback is required in the configuration');
      }
      if (typeof this.config.onEvent !== 'function') {
        throw new Error('onEvent callback is required in the configuration');
      }
      // Bind methods to ensure correct 'this' context
      this.handleMessage = this.handleMessage.bind(this);
    }

    async getAuthToken(params) {
      const requestData = {
        ...(params.userExternalId ? { user_external_id: params.userExternalId } : {}),
        mode: params.mode || 1,
        ...((!params.mode || params.mode == 1 || params.mode == 3) ? { 
          partner_id: params.partnerId, 
          merchant_id: params.merchantId 
        } : {}),
        display_name: params.displayName,
        ...(params.partnershipId ? { partnership_id: params.partnershipId } : {})
      };

      try {
        const response = await fetch(`${this.config.authServiceUrl}/verify/token/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.bearerToken}`
          },
          body: JSON.stringify(requestData)
        });

        const data = await response.json();
        return data.data.token;
      } catch (error) {
        console.error('Error in getAuthToken:', error);
        throw error;
      }
    }

    async initialize(params) {
      try {
        const token = await this.getAuthToken(params);
        this.config.token = token;
      } catch (error) {
        console.error('Failed to initialize SDK:', error);
        throw error;
      }
    }

    async openWithParams(params) {
      try {
        await this.initialize(params);
        this.open();
      } catch (error) {
        console.error('Failed in openWithParams:', error);
        throw error;
      }
    }

    open() {
      if (this.iframe) {
        console.warn('Authentication iframe is already open');
        return;
      }
      // Create container for iframe
      this.iframeContainer = document.createElement('div');
      this.iframeContainer.style.position = 'fixed';
      this.iframeContainer.style.top = '0';
      this.iframeContainer.style.left = '0';
      this.iframeContainer.style.width = '100%';
      this.iframeContainer.style.height = '100%';
      this.iframeContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      this.iframeContainer.style.zIndex = '9999';
      this.iframeContainer.style.display = 'flex';
      this.iframeContainer.style.alignItems = 'center';
      this.iframeContainer.style.justifyContent = 'center';
      this.iframeContainer.style.overflow = 'auto';

      // Create iframe
      const timestamp = new Date().getTime();
      const url = new URL(this.config.authUrl);
      url.searchParams.set('code', this.config.token);
      url.searchParams.set('t', timestamp);
      this.iframe = document.createElement('iframe');
      this.iframe.src = url.toString();
      this.iframe.style.position = 'relative';
      this.iframe.style.width = '400px';
      this.iframe.style.height = '645px';
      this.iframe.style.border = 'none';
      this.iframe.style.borderRadius = '20px';
      this.iframe.style.overflow = 'hidden';

      this.iframeContainer.appendChild(this.iframe);
      document.body.appendChild(this.iframeContainer);

      window.addEventListener('message', this.handleMessage);

      this.iframeContainer.addEventListener('click', (event) => {
        if (event.target === this.iframeContainer) {
          this.close();
        }
      });
    }

    close() {
      if (this.iframe) {
        window.removeEventListener('message', this.handleMessage);
        document.body.removeChild(this.iframeContainer);
        this.iframe = null;
        this.iframeContainer = null;
        this.config.onExit();
      }
    }

    cleanup() {
      if (this.iframe) {
        this.close();
      }
    }

    handleMessage(event) {
      if (event.origin !== new URL(this.config.authUrl).origin) return;
      const { type, data } = event.data;
      switch (type) {
        case 'authSuccess':
          this.config.onSuccess(data.token, data.metadata);
          this.close();
          break;
        case 'authExit':
          this.close();
          break;
        default:
          this.config.onEvent({ type, data });
      }
    }
}

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
    window.ConnectSDK = ConnectSDK;
}

export default ConnectSDK;