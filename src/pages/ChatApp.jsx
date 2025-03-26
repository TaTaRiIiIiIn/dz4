import React, { useEffect, useRef, useState } from "react";

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:3000");

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "history") {
        setMessages(message.data.map((msg) => msg.data));
      } else if (message.type === "message") {
        setMessages((prev) => [...prev, message.data]);
      }
    };

    return () => {
      socketRef.current.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (inputValue.trim() !== "") {
      const newMessage = {
        type: "message",
        data: inputValue,
      };
      socketRef.current.send(JSON.stringify(newMessage));
      setInputValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-4">
        <h1 className="text-xl font-bold mb-4 text-center">WebSocket Chat</h1>
        <div className="h-80 overflow-y-auto border rounded-lg p-2 mb-4 bg-gray-50">
          {messages.map((msg, index) => (
            <div key={index} className="bg-blue-500 text-white px-3 py-2 mb-2 rounded-md w-fit max-w-xs">
              {msg}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex">
          <input
            type="text"
            placeholder="Введите сообщение"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-grow border border-gray-300 rounded-l-lg p-2 "
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600"
          >
            Отправить
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
