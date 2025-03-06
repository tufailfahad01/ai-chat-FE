
import React from "react";
import { MessageSquarePlus, MessagesSquare } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { setCurrentChat } from "../redux/slice/chatSlice";
import { RootState } from "../redux/store/store";

export function ChatSidebar({ setCreateChat }: any) {
  const dispatch = useDispatch();
  const { chats, currentChatId } = useSelector(
    (state: RootState) => state.chat
  );

  return (
    <aside className="w-64 bg-gray-900 h-screen flex flex-col">
      <div className="p-4">
        <button
          onClick={() => {
            setCreateChat(true); 

          }}
          className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors"
        >
          <MessageSquarePlus size={20} />
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => dispatch(setCurrentChat(chat.id))}
            className={`w-full text-left p-4 flex items-center gap-2 hover:bg-gray-800 transition-colors ${
              chat.id === currentChatId ? "bg-gray-800" : ""
            }`}
          >
            <MessagesSquare size={20} className="text-gray-400" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-200 truncate">{chat.title}</p>
              <p className="text-xs text-gray-400">
                {new Date(chat.createdAt).toLocaleDateString()}
              </p>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
