const express = require("express");
const { WebSocketServer } = require("ws");
const http = require("http");

const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (data) => {
    // Expect JSON: { user, message }
    try {
      const parsed = JSON.parse(data);
      const broadcastData = JSON.stringify({
        user: parsed.user,
        message: parsed.message,
      });

      // Send to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === ws.OPEN) {
          client.send(broadcastData);
        }
      });
    } catch (err) {
      console.error("Invalid JSON", err);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
