"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaFacebookF } from "react-icons/fa";

interface AuthFormProps {
  type: "login" | "register";
  onSubmit: (data: { email: string; password: string; name?: string }) => void;
}

export default function AuthForm({ type, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setname] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password, ...(type === "register" && { name }) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 font-sans">
      {type === "register" && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">name</label>
          <input
            type="text"
            placeholder="yourname"
            className="w-full px-4 py-2 border-[2px] border-[#5250F9] rounded-md focus:outline-none focus:ring focus:ring-[#5250F9]"
            value={name}
            onChange={(e) => setname(e.target.value)}
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          placeholder="name@gmail.com"
          className="w-full px-4 py-2 border-[2px] border-[#5250F9] rounded-md focus:outline-none focus:ring focus:ring-[#5250F9]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border-[2px] border-[#5250F9] rounded-md focus:outline-none focus:ring focus:ring-[#5250F9]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {type === "login" && (
          <div className="text-right text-sm mt-1 text-[#232360] cursor-pointer hover:underline">
            Forgot Password?
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-[#5250F9] text-white py-2 rounded-md hover:bg-[#3f3dfa] transition duration-300"
      >
        {type === "login" ? "Sign in" : "Register"}
      </button>

      <div className="flex items-center my-6">
        <div className="flex-grow h-px bg-gray-300" />
        <span className="mx-4 text-sm text-gray-400">or continue with</span>
        <div className="flex-grow h-px bg-gray-300" />
      </div>

      <div className="flex justify-center space-x-4">
        <button className="border-[2px] border-[#5250F9] rounded-md p-2 hover:bg-gray-100 transition">
          <FcGoogle className="text-xl" />
        </button>
        <button className="border-[2px] border-[#5250F9] rounded-md p-2 hover:bg-gray-100 transition">
          <FaGithub className="text-xl" />
        </button>
        <button className="border-[2px] border-[#5250F9] rounded-md p-2 hover:bg-gray-100 transition">
          <FaFacebookF className="text-[#1877F2] text-xl" />
        </button>
      </div>
    </form>
  );
}
