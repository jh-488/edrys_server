const WEB_SOCKET_PORT = process.env.WEB_SOCKET_PORT || 8080;

// Websocket server configuration
const WebSocket = require("ws");
const WebSocketServer = new WebSocket.Server({ port: WEB_SOCKET_PORT });

const { compileAndUploadSketch } = require("./controllers/sketchControllers");

const { randomizeLEDs } = require("./controllers/randomizeLEDs");

const { testFunctions } = require("./challengesTests/challengesTests");


WebSocketServer.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", async (data) => {

    const parsedData = JSON.parse(data);

    // Handle the "missing-led" challenge 
    if (parsedData.action === "randomizeLeds") {
      randomizeLEDs(ws);
    } else {
      // get the challengeId and code from the client (editor)
      const { challengeId, code } = JSON.parse(data);

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
