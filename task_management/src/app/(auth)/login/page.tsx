"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthForm from "@/components/common/AuthForm";
import { login } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    try {
      await login(email, password);
      router.push("/tasks");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-white px-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-xl shadow-[0_10px_50px_rgba(82,80,249,0.4)] p-8 border-[2px] border-[#5250F9]">
        <Image src="/icons/logo.svg" alt="Logo" width={24} height={24} className="rounded-full mb-2" />
        <h3 className="text-2xl font-semibold text-center mb-6 text-gray-800">Login</h3>
        <AuthForm type="login" onSubmit={handleLogin} />
        <p className="text-center text-sm mt-6">
          Don’t have an account yet?{" "}
          <a href="/register" className="text-[#5250F9] hover:underline">
            Register for free
          </a>
        </p>
      </div>
    </main>
  );
}
