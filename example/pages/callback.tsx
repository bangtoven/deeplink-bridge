import { deepLinkCallbackHandler } from "deep-link-bridge";
import { useEffect } from "react";

export default function CallbackHandler() {
  useEffect(() => {
    deepLinkCallbackHandler({
      storageKeyPrefix: "my-app",
      paramKey: "response_data",
    });
  }, []);

  return <main>i got a big box yes i do, i got a big box how about you</main>;
}
