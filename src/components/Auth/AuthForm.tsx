import React, { useState } from "react";
import { Bot } from "lucide-react";

import { loginUser, registerUser } from "../../redux/slice/authSlice";
import { useAppDispatch } from "../../redux/store/store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
export function AuthForm() {
  const [type, setType] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (type === "login") {
      dispatch(loginUser({ email, password }))
        .unwrap()
        .then(() => {
          toast.success("Login successful!");
          navigate("/dashboard");
        })
        .catch((err) => {
          toast.error(err?.message || "Login failed!");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      dispatch(registerUser({ name, email, password }))
        .unwrap()
        .then(() => {
          toast.success("Registration successful!");
          setType("login");
        })
        .catch((err) => {
          toast.error(err?.message || "Registration failed!");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <Bot className="mx-auto h-12 w-12 text-blue-500" />
          <h2 className="mt-4 text-2xl font-semibold text-white">
            {type === "login"
              ? "Sign in to your account"
              : "Create your account"}
          </h2>
        </div>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {type === "register" && (
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? (
                <ThreeDots
                  height="28"
                  width="40"
                  radius="9"
                  color="#FFFFFF"
                  ariaLabel="three-dots-loading"
                  visible
                />
              ) : type === "login" ? (
                "Sign in"
              ) : (
                "Sign up"
              )}
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => setType(type === "login" ? "register" : "login")}
            className="text-blue-400 hover:underline"
          >
            {type === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
