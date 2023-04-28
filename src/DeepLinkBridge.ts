// DeepLinkBridge.ts
export type CancelToken = {
  isCanceled: boolean;
};

type DeepLinkBridgeOptions = {
  callbackUrl: string;
  storageKeyPrefix?: string;
  fallbackUrl?: string;
  universalLinkUrl?: string;
};

type SendRequestOptions = {
  deepLinkUrl: string;
  cancelToken?: CancelToken;
};

export class DeepLinkBridge {
  private callbackUrl: string;
  private storageKeyPrefix: string;
  private fallbackUrl?: string;
  private universalLinkUrl?: string;

  constructor(options: DeepLinkBridgeOptions) {
    const {
      callbackUrl,
      storageKeyPrefix = "DeepLinkBridge:",
      fallbackUrl,
      universalLinkUrl,
    } = options;
    this.callbackUrl = callbackUrl;
    this.storageKeyPrefix = storageKeyPrefix;
    this.fallbackUrl = fallbackUrl;
    this.universalLinkUrl = universalLinkUrl;
  }

  public sendRequest(options: SendRequestOptions): Promise<unknown> {
    const { deepLinkUrl, cancelToken } = options;

    return new Promise((resolve, reject) => {
      const storageKey = `${this.storageKeyPrefix}callbackData`;

      const handleStorageEvent = (event: StorageEvent) => {
        if (cancelToken && cancelToken.isCanceled) {
          window.removeEventListener("storage", handleStorageEvent);
          return;
        }

        if (event.key === storageKey && event.newValue) {
          const data = JSON.parse(event.newValue);
          resolve(data);
          localStorage.removeItem(storageKey);
          window.removeEventListener("storage", handleStorageEvent);
        }
      };

      window.addEventListener("storage", handleStorageEvent);

      const url = `${this.callbackUrl}#deepLinkUrl=${encodeURIComponent(
        deepLinkUrl
      )}`;
      const newWindow = window.open(url);

      // Fallback handling
      setTimeout(() => {
        if (
          !newWindow ||
          newWindow.closed ||
          typeof newWindow.closed === "undefined"
        ) {
          if (this.fallbackUrl) {
            window.location.href = this.fallbackUrl;
          } else if (this.universalLinkUrl) {
            window.location.href = this.universalLinkUrl;
          } else {
            reject(new Error("Redirection failed"));
          }
        }
      }, 3000);
    });
  }
}
