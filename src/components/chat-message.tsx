import React from "react";
import { cn } from "../lib/utils";
import type { Message } from "../types/chat";

interface ChatMessageProps {
  message: Message;
  isAssistant?: string;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === "user";

  return (
    <div
      className={cn(
        "flex w-full gap-2 p-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "rounded-lg px-4 py-2 max-w-[80%]",
          isUser ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <span className="text-xs opacity-50 mt-1 block">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
