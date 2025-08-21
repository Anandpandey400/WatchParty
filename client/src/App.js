import React, { useEffect, useState, useRef } from "react";
import Navbar from "./components/Navbar";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:3001");

    ws.current.onmessage = async (event) => {
      let text = event.data;
      if (event.data instanceof Blob) {
        text = await event.data.text();
      }
      try {
        const { user, message } = JSON.parse(text);
        setMessages((prev) => [...prev, { user, message }]);
      } catch {
        console.error("Invalid message format");
      }
    };

    return () => ws.current.close();
  }, []);

  const sendMessage = () => {
    if (input.trim() && username.trim()) {
      const msgData = { user: username, message: input };
      ws.current.send(JSON.stringify(msgData));
      setInput("");
    }
  };

  if (!username) {
    // Username prompt
    return (
      <div
        style={{
          height: "100vh",
          backgroundColor: "#111",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Enter your username</h2>

        <input
          type="text"
          onKeyDown={(e) =>
            e.key === "Enter" && e.target.value && setUsername(e.target.value)
          }
          placeholder="Username"
          style={{
            background: "#222",
            border: "none",
            borderRadius: "6px",
            padding: "10px",
            color: "#fff",
            outline: "none",
            marginBottom: "10px",
            width: "200px",
            textAlign: "center",
          }}
        />

        <button
          onClick={() => {
            const name = document.querySelector("input").value.trim();
            if (name) setUsername(name);
          }}
          style={{
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Join Chat
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "grid",
        gridTemplateRows: "auto 1fr auto",
        backgroundColor: "#111",
        color: "#fff",
        fontFamily: "sans-serif",
      }}
    >
      {/* Navbar */}
      <div
        style={{
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#1a1a1a",
          fontWeight: "bold",
        }}
      >
        <span>nakama party</span>
        <span>{username}</span>
      </div>

      {/* Chat content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "10px",
          padding: "10px",
          overflow: "hidden",
        }}
      >
        {/* Main content */}
        <div
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          temp div with black ground
        </div>

        {/* Chat messages */}
        <div
          style={{
            backgroundColor: "#1a1a1a",
            borderRadius: "6px",
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: "5px" }}>
              <strong>{msg.user}: </strong>
              {msg.message}
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          backgroundColor: "#1a1a1a",
          gap: "10px",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          style={{
            flex: 1,
            background: "#222",
            border: "none",
            borderRadius: "6px",
            padding: "10px",
            color: "#fff",
            outline: "none",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "10px 15px",
            cursor: "pointer",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
