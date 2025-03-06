import { MessageSquare } from "lucide-react";
import { AssistantCard } from "../components/assistant-card";
import { ChatMessage } from "../components/chat-message";
import { ChatSidebar } from "../components/chat-sidebar";
import { ChatInput } from "../components/chat-input";
import { Assistant, DecodedToken } from "../types/chat";
import { RootState, useAppDispatch } from "../redux/store/store";
import { useSelector } from "react-redux";
import { logout } from "../redux/slice/authSlice";
import { getDecodedToken } from "../lib/utils";
import { useEffect, useState } from "react";
import { getAllChats, setCurrentChat } from "../redux/slice/chatSlice";

const assistants: Assistant[] = [
  {
    id: "1",
    value: "prd",
    name: "PRD Assistant",
    description:
      "A specialized AI agent for helping with PRD (Product Requirements Document) generation. Model: gpt-4o",
    icon: <MessageSquare />,
  },
  {
    id: "2",
    value: "legal",
    name: "Legal Policy GPT",
    description:
      "An AI agent to assist with legal topics such as policy template creation. Model: gpt-4o",
    icon: <MessageSquare />,
  },
  {
    id: "3",
    value: "generic",
    name: "General Chat",
    description:
      "An AI assistant for everyday tasks and general conversations. Model: gpt-4o",
    icon: <MessageSquare />,
  },
  {
    id: "4",
    value: "research",
    name: "Research Assistant",
    description: "An AI agent designed to help with research topics",
    icon: <MessageSquare />,
  },
];

function Dashboard() {
  const dispatch = useAppDispatch();
  const { chats, currentChatId } = useSelector(
    (state: RootState) => state.chat
  );
  const currentChat = chats.find((chat) => chat.id === currentChatId);
  const token = getDecodedToken() as DecodedToken;
  const [chatAssistant, setChatAssistant] = useState<Assistant | null>(null);
  const [loading, setLoading] = useState(false);
  const [createChat, setCreateChat] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(getAllChats())
      .unwrap()
      .finally(() => setLoading(false));
    if (assistants.length > 0) {
      setChatAssistant(assistants[0]);
    }
  }, []);

  const handleAssistantSelect = (assistant: Assistant) => {
    setChatAssistant(assistant);
  };
  const handleNewChatClick = () => {
    setCreateChat(true); // Show the input field
  };
  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Top Header */}
      <header className="border-b border-gray-700 p-4 bg-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">AI Chat Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              Welcome, {token?.name}
            </span>
            <button
              className="text-sm text-red-500 hover:text-red-600"
              onClick={() => dispatch(logout())}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <ChatSidebar setCreateChat={setCreateChat} />

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <header className="border-b border-gray-700 p-4 bg-gray-800">
            <h1 className="text-xl font-semibold">AI Chat Assistant</h1>
          </header>

          {/* Chat Content */}
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-[#260944] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              {currentChat ? (
                <>
                  {/* Assistant Cards at the Top */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {assistants.map((assistant) => (
                      <AssistantCard
                        key={assistant.id}
                        assistant={assistant}
                        isSelected={chatAssistant?.id === assistant.id} // Pass isSelected prop
                        onSelect={() => handleAssistantSelect(assistant)} // Pass onSelect handler
                      />
                    ))}
                  </div>

                  {/* Chat Messages */}
                  <div className="space-y-4">
                    {currentChat.messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                  </div>
                </>
              ) : (
                /* No Chat Selected - Show Assistant List */
                <div>
                  <h2 className="text-2xl font-bold mb-6">
                    Choose an Assistant
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {assistants.map((assistant) => (
                      <AssistantCard
                        key={assistant.id}
                        assistant={assistant}
                        isSelected={chatAssistant?.id === assistant.id} // Pass isSelected prop
                        onSelect={() => handleAssistantSelect(assistant)} // Pass onSelect handler
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat Input */}
          {/* {createChat && currentChat && (
            <ChatInput chatId={currentChat.id} chatAssistant={chatAssistant} />
          )} */}
          {(currentChat || createChat) && (
            <ChatInput
              chatId={currentChat?.id} // Optional: Pass `chatId` if it exists
              chatAssistant={chatAssistant} // Pass the selected assistant
              onCreateNewChat={(message) => {
                // Handle new chat creation here
                const newChat = {
                  id: String(chats.length + 1), // Generate a new ID
                  title: `Chat ${chats.length + 1}`,
                  messages: [message],
                  lastMessageAt: new Date().toISOString(),
                };
                dispatch(setCurrentChat(newChat.id)); // Set the new chat as current
              }}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
