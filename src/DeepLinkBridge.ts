// DeepLinkBridge.ts
export type CancelToken = {
  isCanceled: boolean;
};

type DeepLinkBridgeOptions = {
  callbackPath: string;
  storageKeyPrefix?: string;
};

type SendRequestOptions = {
  deepLinkUrl: string;
  cancelToken?: CancelToken;
};

export class DeepLinkBridge {
  private callbackPath: string;
  private storageKeyPrefix: string;

  constructor(options: DeepLinkBridgeOptions) {
    const { callbackPath = "callback", storageKeyPrefix = "DeepLinkBridge:" } =
      options;

    this.callbackPath = callbackPath;
    this.storageKeyPrefix = storageKeyPrefix;
  }

  public sendRequest(options: SendRequestOptions): Promise<unknown> {
    const { deepLinkUrl, cancelToken } = options;

    return new Promise((resolve, reject) => {
      const storageKey = `${this.storageKeyPrefix}callbackData`;

      const handleStorageEvent = (event: StorageEvent) => {
        console.log("storage event on sendRequest", event);

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

      const callbackUrl = new URL(window.location.href);
      callbackUrl.pathname = this.callbackPath;

      const url = new URL(deepLinkUrl);
      url.searchParams.append("callback_url", callbackUrl.href);

      window.open(url.href.toString(), "_blank");

      // // Fallback handling
      // setTimeout(() => {
      //   if (
      //     !newWindow ||
      //     newWindow.closed ||
      //     typeof newWindow.closed === "undefined"
      //   ) {
      //     reject(new Error("Redirection failed"));
      //   }
      // }, 3000);
    });
  }
}
