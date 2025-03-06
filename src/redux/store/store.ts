import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../slice/chatSlice";
import authSlice from "../slice/authSlice";
import { useDispatch } from "react-redux";

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth: authSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

