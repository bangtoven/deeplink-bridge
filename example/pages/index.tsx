import { DeepLinkBridge } from "@/../dist";
import { useState } from "react";
import { Box, Button, Container, Heading, Input, Text } from "@chakra-ui/react";

export default function Home() {
  const [randomValue, setRandomValue] = useState(
    Math.floor(Math.random() * 100) + 1
  );
  const [response, setResponse] = useState("");
  const [log, setLog] = useState("");

  const deepLinkBridge = new DeepLinkBridge({
    callbackPath: "/callback",
    storageKeyPrefix: "my-app",
  });

  const handleGenerateRandomValue = () => {
    const newRandomValue = Math.floor(Math.random() * 100) + 1;
    setRandomValue(newRandomValue);
    setLog(`Generated new random value: ${newRandomValue}`);
  };

  const handleMakeRequestToMyWallet = async () => {
    console.log("onClick");
    const url = "my-wallet://request?param=1";

    try {
      const response = await deepLinkBridge.sendRequest({
        deepLinkUrl: url,
      });
      setResponse(String(response));
      setLog("Request to My Wallet successful");
    } catch (error) {
      console.error(error);
      setLog("Error making request to My Wallet");
    }
  };

  return (
    <Container maxW="xl" centerContent>
      <Heading as="h1" size="xl" mb="4">
        My Page
      </Heading>
      <Box display="flex" alignItems="center">
        <Input mb="2" type="text" value={randomValue} isReadOnly />
      </Box>
      <Button mb="8" colorScheme="blue" onClick={handleGenerateRandomValue}>
        Random Value
      </Button>
      <Button colorScheme="green" mb="2" onClick={handleMakeRequestToMyWallet}>
        Make Request to My Wallet
      </Button>
      <Box>
        <Text fontSize="xl" fontWeight="bold" mb="2">
          Response from My Wallet
        </Text>
        <Text whiteSpace="pre-wrap">{JSON.stringify(response, null, 2)}</Text>
      </Box>
      <Box mt="4">
        <Text fontSize="xl" fontWeight="bold" mb="2">
          Logging
        </Text>
        <Text whiteSpace="pre-wrap">{log}</Text>
      </Box>
    </Container>
  );
}
