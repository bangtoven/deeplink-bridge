interface DeepLinkCallbackHandlerOptions {
  storageKeyPrefix?: string;
  paramKey?: string;
}

export function deepLinkCallbackHandler({
  storageKeyPrefix = "DeepLinkBridge:",
  paramKey = "response_data",
}: DeepLinkCallbackHandlerOptions): void {
  const urlParams = new URLSearchParams(window.location.search);
  const responseData = urlParams.get(paramKey);

  if (responseData) {
    const storageKey = `${storageKeyPrefix}callbackData`;
    localStorage.setItem(storageKey, responseData);
    window.close();
  }
}
