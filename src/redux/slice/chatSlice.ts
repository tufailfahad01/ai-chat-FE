import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { Chat, DecodedToken, Message } from "../../types/chat";
import api from "../../services/api";
import { getDecodedToken } from "../../lib/utils";

interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  chats: [],
  currentChatId: null,
  loading: false,
  error: null,
};

// Async Thunk to send a message to the AI
export const sendMessageToAI = createAsyncThunk(
  "chat/sendMessageToAI",
  async (
    payload: { agentType?: string; prompt?: string; bodyChatId?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("chat/ai", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error || "An error occurred");
    }
  }
);
export const getAllChats = createAsyncThunk(
  "chat/getAllChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("chat/history");
      return response.data;
    } catch (error) {
      return rejectWithValue(error || "An error occurred");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<string>) => {
      state.currentChatId = action.payload;
    },

    addMessage: (state, action: PayloadAction<any>) => {
      const { chatId, ...message } = action.payload;

      if (chatId) {
        let chat = state.chats.find((chat) => chat.id === chatId);

        if (!chat) {
          const token = getDecodedToken() as DecodedToken;
          chat = {
            id: chatId,
            userId: token.userId,
            createdAt: new Date().toISOString(),
            messages: [],
          };
          state.chats.push(chat);
          state.currentChatId = chat.id;
        }

        // Add the user's message to the chat
        chat.messages.push(message);
      } else {
        // If no chatId is provided, create a new chat
        const token = getDecodedToken() as DecodedToken;
        const newChat: any = {
          id: new Date().toISOString(),
          userId: token.userId,
          createdAt: new Date().toISOString(),
          messages: [message],
        };
        state.chats.push(newChat);
        state.currentChatId = newChat.id;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageToAI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(sendMessageToAI.fulfilled, (state, action) => {
        state.loading = false;

        const { chatId, response } = action.payload.data;

        // Find the chat in the state
        let chat = state.chats.find((chat) => chat.id === chatId);

        // If the chat doesn't exist (new chat), create it
        if (!chat) {
          const token = getDecodedToken() as DecodedToken;
          chat = {
            id: chatId || new Date().toISOString(), 
            userId: token.userId,
            createdAt: new Date().toISOString(),
            messages: [],
          };
          state.chats.push(chat);
          state.currentChatId = chat.id;
        }

        // Add the AI's response to the chat
        chat.messages.push({
          id: new Date().toISOString(),
          chatId: chat.id,
          sender: "ai",
          content: response,
          timestamp: new Date().toISOString(),
          role: "user",
        });
      })
      .addCase(sendMessageToAI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAllChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action?.payload?.data;
      });
  },
});

export const { setCurrentChat, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
