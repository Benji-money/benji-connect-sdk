(function(root){

    const BenjiConnect = {};

    class ConnectSDK {
      constructor(config) {
          this.config = {            
            ...config
          };
          if (config.env === 'sandbox') {
            this.config.authServiceUrl = 'https://authservice-staging.withbenji.com';
            this.config.authUrl = 'https://verifyapp-staging.withbenji.com';
          }
          else if (config.env === 'production') {
            this.config.authServiceUrl = 'https://authservice.withbenji.com';
            this.config.authUrl = 'https://verifyapp.withbenji.com';
          }
          else if (config.env === 'development') {
            this.config.authServiceUrl = 'https://authservice-staging.withbenji.com';
            this.config.authUrl = 'http://localhost:3000';
          }
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
            ...((!params.mode || params.mode != 2) ? { 
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
          url.searchParams.set('t', timestamp);  // Add timestamp for cache busting
          this.iframe = document.createElement('iframe');
          this.iframe.src = url.toString();
          this.iframe.style.position = 'relative';
          this.iframe.style.width = '400px';
          this.iframe.style.height = '645px';
          this.iframe.style.border = 'none';
          this.iframe.style.borderRadius = '20px';
          this.iframe.style.overflow = 'hidden';
          // Append iframe to container and container to body
          this.iframeContainer.appendChild(this.iframe);
          document.body.appendChild(this.iframeContainer);
          // Add event listener for messages from iframe
          window.addEventListener('message', this.handleMessage);
          // Add click event to container to close iframe when clicking outside
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
          // Additional cleanup if necessary
        }
        handleMessage(event) {

          // Ensure the message is from your iframe
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
            //  this.config.onEvent({ type, data });
          }
        }

        // For debugging
        ping() {
          if (BenjiConnect.DEBUG) console.debug('[Benji Connect SDK] ping');
          return 'pong';
        }
    }
      BenjiConnect.ConnectSDK = ConnectSDK;
      BenjiConnect.VERSION = __VERSION__;
      BenjiConnect.DEBUG = true;
      
      root.ConnectSDK = ConnectSDK;
    })(typeof window !== 'undefined' ? window : globalThis);
    /*
      (typeof window !== 'undefined' ? window : globalThis)
      In a browser, window.ConnectSDK is created.
      In Node, global.ConnectSDK is created (handy for debugging or testing).
      In Web Workers, self.ConnectSDK is created.
      No reference errors occur if window doesn’t exist.
    */