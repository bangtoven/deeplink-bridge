import { DeepLinkBridge } from "@/../dist";
import { useState } from "react";

export default function Home() {
  // response
  const [response, setResponse] = useState<string | null>(null);

  const deepLinkBridge = new DeepLinkBridge({
    callbackPath: "/callback",
    storageKeyPrefix: "my-app",
  });

  // onClick
  const onClick = async () => {
    console.log("onClick");
    const url = "my-wallet://request?param=1";

    const response = await deepLinkBridge.sendRequest({
      deepLinkUrl: url,
    });

    setResponse(String(response));
  };

  return (
    <main>
      <h1>Deep Link Bridge Example</h1>
      <button onClick={onClick}>Button</button>
      <p>
        <strong>Response:</strong> <span id="response">{response}</span>
      </p>
    </main>
  );
}
