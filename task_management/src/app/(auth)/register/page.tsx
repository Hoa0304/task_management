"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import AuthForm from "@/components/common/AuthForm";
import { register } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async ({
    email,
    password,
    name,
  }: {
    email: string;
    password: string;
    name?: string;
  }) => {
    try {
      await register(email, password, name);
      router.push("/tasks");
    } catch (error) {
      alert("Registration failed");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-white px-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-xl shadow-[0_10px_50px_rgba(82,80,249,0.4)] p-8 border-[2px] border-[#5250F9]">
        <Image src="/icons/logo.svg" alt="Logo" width={24} height={24} className="rounded-full mb-2" />
        <h3 className="text-2xl font-semibold text-center mb-6 text-gray-800">Register</h3>
        <AuthForm type="register" onSubmit={handleRegister} />
        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-[#5250F9] hover:underline">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}
