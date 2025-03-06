import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import type { Chat, Message } from "../../types/chat";
import api from "../../services/api";

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessageToAI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessageToAI.fulfilled, (state, action) => {
        state.loading = false;

        state.chats.push(action?.payload?.data);
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

export const { setCurrentChat } = chatSlice.actions;
export default chatSlice.reducer;
