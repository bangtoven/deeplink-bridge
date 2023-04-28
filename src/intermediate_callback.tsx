// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { h, render } from "preact";
import { useEffect } from "preact/hooks";

interface IntermediateCallbackProps {
  storageKeyPrefix?: string;
}

const IntermediateCallback = (props: IntermediateCallbackProps) => {
  const { storageKeyPrefix = "DeepLinkBridge:" } = props;

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const responseData = hashParams.get("response_data");

    if (responseData) {
      const storageKey = `${storageKeyPrefix}callbackData`;
      localStorage.setItem(storageKey, responseData);
      window.close();
    }
  }, [storageKeyPrefix]);

  return null;
};

render(
  <IntermediateCallback storageKeyPrefix="YourCustomPrefix:" />,
  document.body
);
