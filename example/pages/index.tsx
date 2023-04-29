import { DeepLinkBridge } from "@/../dist";
import { useState } from "react";

export default function Home() {
  // response
  const [response, setResponse] = useState<string | null>(null);

  const deepLinkBridge = new DeepLinkBridge({
    callbackUrl: "http://localhost:3000/callback",
    storageKeyPrefix: "my-app",
    fallbackUrl: "https://coinbase.com",
    universalLinkUrl: "https://coinbase.com",
  });

  // onClick
  const onClick = async () => {
    console.log("onClick");
    const url = "https://example.com/";

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
