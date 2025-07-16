"use client";

import React from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Image from "next/image";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full">
      <Sidebar />
      <main className="flex-1 bg-gray-50 font-sans ">
        <Header />
        <div className="flex items-center gap-2 text-3xl font-semibold ml-10">
          <Image
            src="/icons/fire.png"
            alt="Logo"
            width={25}
            height={25}
          />
          <div className="text-black font-sans">Task</div>
        </div>

        {children}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    // <AuthProvider>
    <DashboardLayout>{children}</DashboardLayout>
    // </AuthProvider>
  );
};

export default DashboardWrapper;
