import { DeepLinkBridge } from "@/../dist";
import { useState } from "react";
import { Box, Button, Container, Heading, Input, Text } from "@chakra-ui/react";
import { Service } from "bonjour-service";

export default function Home() {
  const [randomValue, setRandomValue] = useState(
    Math.floor(Math.random() * 100) + 1
  );
  const [response, setResponse] = useState("");
  const [log, setLog] = useState("");
  const [relayServerInfo, setRelayServerInfo] = useState<Service | null>(null);

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
    const url = `my-wallet://request?param=${randomValue}`;

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

  const handleDiscoverRelayServer = async () => {
    try {
      const _relayServerInfo = await deepLinkBridge.discoverRelayServer();
      setRelayServerInfo(_relayServerInfo);
      setLog(`Discovered Relay Server: ${JSON.stringify(_relayServerInfo)}`);
    } catch (error) {
      console.error(error);
      setLog(`Error discovering Relay Server: ${error.message}`);
    }
  };

  const handleConnectToRelayServer = async (_relayServerInfo: Service) => {
    try {
      const websocket = new WebSocket(
        `ws://${_relayServerInfo.host}:${_relayServerInfo.port}`
      );
      await new Promise((resolve, reject) => {
        websocket.addEventListener("open", resolve);
        websocket.addEventListener("error", reject);
      });

      setLog(
        `Connected to Relay Server at ${_relayServerInfo.host}:${_relayServerInfo.port}`
      );
    } catch (error) {
      console.error(error);
      setLog("Error connecting to Relay Server");
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
      <Box mt="4" mb="8">
        <Text fontSize="xl" fontWeight="bold" mb="2">
          Relay Server
        </Text>
        {relayServerInfo ? (
          <>
            <Text>Discovered server:</Text>
            <Text>Name: {relayServerInfo.name}</Text>
            <Text>Type: {relayServerInfo.type}</Text>
            <Text>Host: {relayServerInfo.host}</Text>
            <Text>Port: {relayServerInfo.port}</Text>
            <Button
              colorScheme="green"
              mb="2"
              onClick={() => handleConnectToRelayServer(relayServerInfo)}
            >
              Connect to Relay Server
            </Button>
          </>
        ) : (
          <>
            <Text>No relay server discovered yet</Text>
            <Button
              colorScheme="green"
              mb="2"
              onClick={handleDiscoverRelayServer}
            >
              Discover Relay Server
            </Button>
          </>
        )}
      </Box>
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
