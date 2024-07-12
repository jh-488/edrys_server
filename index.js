const WEB_SOCKET_PORT = process.env.WEB_SOCKET_PORT || 8080;

// Websocket server configuration
const WebSocket = require("ws");
const WebSocketServer = new WebSocket.Server({ port: WEB_SOCKET_PORT });

const { compileAndUploadSketch } = require("./controllers/sketchControllers");
const { testFunctions } = require("./challengesTests/challengesTests");
const { randomizeLEDs } = require("./controllers/randomizeLEDs");

WebSocketServer.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (data) => {
    // get the challengeId and code from the client (editor or missing led module)
    const { challengeId, code } = JSON.parse(data);

    // handle randomize leds message from the missing led module
    if (challengeId === "randomize-leds") {
      randomizeLEDs(ws);
    } else {
      // Get the test function for the challenge if available
      const testSketch = testFunctions(challengeId, code);

      // Run the test if available, otherwise compile and upload the user's sketch
      if (testSketch) {
        compileAndUploadSketch(testSketch, ws, true);
      } else {
        compileAndUploadSketch(code, ws, false);
      }
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log(`Websocket server started at port ${WEB_SOCKET_PORT}`);
