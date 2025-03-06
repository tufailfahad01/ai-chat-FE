import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { cn } from "../lib/utils";
import { Assistant } from "../types/chat";

import {
  addMessage,
  sendMessageToAI,
  setCurrentChat,
} from "../redux/slice/chatSlice";
import { RootState, useAppDispatch } from "../redux/store/store";
import { useSelector } from "react-redux";

interface ChatWindowProps {
  chatId?: string;
  chatAssistant?: Assistant | null;
  createChat?: boolean;
}

export function ChatWindow({
  chatId,
  chatAssistant,
  createChat,
}: ChatWindowProps) {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { chats, currentChatId } = useSelector(
    (state: RootState) => state.chat
  );
  const currentChat = chats.find((chat) => chat.id === currentChatId);

  useEffect(() => {
    if (createChat) {
      dispatch(setCurrentChat(""));
    } else if (chatId) {
      dispatch(setCurrentChat(chatId));
    }
  }, [chatId, createChat, dispatch]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      id: new Date().toISOString(),
      chatId: chatId || currentChatId,
      sender: "user",
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessage(userMessage));

    setLoading(true);
    setMessage("");

    try {
      let response;
      if (chatId) {
        response = await dispatch(
          sendMessageToAI({
            agentType: chatAssistant?.value || "prd",
            prompt: userMessage.content,
            bodyChatId: chatId,
          })
        ).unwrap();
      } else {
        response = await dispatch(
          sendMessageToAI({
            agentType: chatAssistant?.value || "prd",
            prompt: userMessage.content,
          })
        ).unwrap();
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {currentChat?.messages?.map((msg: any) => (
          <div
            key={msg.id}
            className={cn(
              "flex w-full gap-2 p-4",
              msg.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "p-3 rounded-lg max-w-screen-md",
                msg.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-white"
              )}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && <div className="text-gray-400 text-center">Loading...</div>}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-gray-700 bg-gray-800 flex "
      >
        <input
          type="text"
          className="flex-1 bg-gray-900 text-white p-2 rounded-l-lg border border-gray-700 focus:outline-none"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg"
          disabled={loading}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}
