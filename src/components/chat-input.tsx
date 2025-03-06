import React, { useState } from "react";
import { Send } from "lucide-react";
import { useAppDispatch } from "../redux/store/store";
import { sendMessageToAI } from "../redux/slice/chatSlice";
import { Assistant } from "../types/chat";

interface ChatInputProps {
  chatId?: string; // Make `chatId` optional
  chatAssistant: Assistant | null;
  onCreateNewChat?: (message: string) => void; // Callback for new chat creation
}

export function ChatInput({
  chatId,
  chatAssistant,
  onCreateNewChat,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (chatId) {
      dispatch(
        sendMessageToAI({
          agentType: chatAssistant?.value || "prd",
          prompt: message.trim(),
          bodyChatId: chatId,
        })
      );
    } else {
      dispatch(
        sendMessageToAI({
          agentType: chatAssistant?.value || "prd",
          prompt: message.trim(),
        })
      );
    }

    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700">
      <div className="flex gap-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 resize-none min-h-[44px] max-h-32"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors"
        >
          <Send size={20} />
        </button>
      </div>
    </form>
  );
}
