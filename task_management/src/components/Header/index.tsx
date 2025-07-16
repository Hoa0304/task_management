"use client";

import { Bell, ChevronDown, Search } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="font-sans flex items-center bg-white justify-between mb-6 px-4">
      <div className="flex-1 flex justify-center p-5">
        <div className="relative w-98% max-w-xs">
          <input
            type="text"
            placeholder="Search anything..."
            className="font-regular w-full pl-4 pr-10 py-2 rounded-lg bg-[#F3F7FA] text-sm text-[#23235F] placeholder:text-[#23235F] focus:outline-none"
          />
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#94A2BC]" />
        </div>
      </div>

      <div className="flex items-center gap-4 mr-3">
        <div className="relative">
          <Bell className="w-5 h-5 text-[#8A94A6]" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#5051F9] rounded-full border-2 border-white" />
        </div>

        <div className="w-8 h-8 rounded-full bg-[#F1EEFF] flex items-center justify-center">
          <Image
            src="/icons/logo.svg"
            alt="User Avatar"
            width={24}
            height={24}
            className="rounded-full"
          />
        </div>

        <ChevronDown className="w-4 h-4 text-[#5250F9] font-bold" />
      </div>
    </header>
  );
}
