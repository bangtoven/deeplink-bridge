// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h } from "preact";
import { useState } from "preact/hooks";
import { DeepLinkBridge, CancelToken } from "./DeepLinkBridge";

const deepLinkBridgeInstance = new DeepLinkBridge({
  callbackUrl: "your_callback_url",
  storageKeyPrefix: "DeepLinkBridge:",
  fallbackUrl: "your_fallback_url",
  universalLinkUrl: "your_universal_link_url",
});

export const DeepLinkRequestUI = () => {
  const [deepLinkUrl, setDeepLinkUrl] = useState("");
  const [cancelToken, setCancelToken] = useState<CancelToken | null>(null);
  const [responseData, setResponseData] = useState<unknown | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSendRequest = () => {
    if (cancelToken) {
      cancelToken.isCanceled = true;
    }

    const newCancelToken: CancelToken = { isCanceled: false };
    setCancelToken(newCancelToken);

    deepLinkBridgeInstance
      .sendRequest({ deepLinkUrl, cancelToken: newCancelToken })
      .then((data) => {
        setResponseData(data);
        setErrorMessage("");
      })
      .catch((error) => {
        setResponseData(null);
        setErrorMessage(error.message);
      });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter deep link URL"
        value={deepLinkUrl}
        onInput={(e) => setDeepLinkUrl((e.target as HTMLInputElement).value)}
      />
      <button onClick={handleSendRequest}>Send Request</button>
      {responseData && <div>Received Data: {JSON.stringify(responseData)}</div>}
      {errorMessage && <div>Error: {errorMessage}</div>}
    </div>
  );
};
