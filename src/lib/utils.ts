import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtDecode } from "jwt-decode";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDecodedToken = (): unknown | null => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        return jwtDecode<unknown>(token); // Specify the return type
      } catch (error) {
        console.error("Invalid token", error);
        return null;
      }
    }
  }
  return null;
};
