import type { Assistant } from "../types/chat";
import { useDispatch } from "react-redux";

interface AssistantCardProps {
  assistant: Assistant;
  isSelected: boolean;
  onSelect: () => void;
}

export function AssistantCard({
  assistant,
  isSelected,
  onSelect,
}: AssistantCardProps) {
  const dispatch = useDispatch();

  return (
    <button
      onClick={() => {
        onSelect(); // Set selected assistant
        // dispatch(createChat()); // Dispatch action if not already selected
      }}
      className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors text-left"
    >
      <div className="flex items-center gap-3 mb-2">
        <span
          className={`text-2xl ${
            isSelected ? "text-blue-500" : "text-gray-400"
          }`}
        >
          {assistant.icon}
        </span>
        <h3
          className={`text-lg font-semibold ${
            isSelected ? "text-blue-400" : "text-white"
          }`}
        >
          {assistant.name}
        </h3>
      </div>
      <p className="text-sm text-gray-400">{assistant.description}</p>
    </button>
  );
}
