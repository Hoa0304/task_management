"use client";

import React from "react";
import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex w-full">
      <Sidebar />
      <main className="flex-1 bg-gray-50 font-sans ">
        <Header />
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
