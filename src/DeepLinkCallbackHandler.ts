interface DeepLinkCallbackHandlerOptions {
  storageKeyPrefix?: string;
}

export function deepLinkCallbackHandler(
  options: DeepLinkCallbackHandlerOptions
): void {
  const { storageKeyPrefix = "DeepLinkBridge:" } = options;

  const handleHashChange = () => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const responseData = hashParams.get("response_data");

    if (responseData) {
      const storageKey = `${storageKeyPrefix}callbackData`;
      localStorage.setItem(storageKey, responseData);
      window.close();
    }
  };

  window.addEventListener("hashchange", handleHashChange);

  // Trigger the handler in case the page is loaded with the hash already in the URL
  handleHashChange();
}
