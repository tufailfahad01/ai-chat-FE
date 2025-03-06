import { ReactElement } from "react";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: number;
  sender?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  lastMessageAt: number;
}

export interface Assistant {
  id: string;
  value: string;
  name: string;
  description: string;
  icon: ReactElement;
}
export interface DecodedToken {
  userId: string;
  name: string;
  iat: number;
  exp: number;
}
