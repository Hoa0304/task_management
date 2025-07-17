"use client";

import {
  LayoutGrid,
  Briefcase,
  BookOpen,
  Settings,
  Send,
  Folder,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const icons = [
  { icon: LayoutGrid, href: "/dashboard", label: "Dashboard" },
  { icon: Briefcase, href: "/projects", label: "Projects" },
  { icon: BookOpen, href: "/tasks", label: "Tasks" },
  { icon: Settings, href: "/settings", label: "Settings" },
  { icon: Send, href: "/inbox", label: "Inbox" },
  { icon: Folder, href: "/files", label: "Files" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full sm:w-20 bg-white shadow-2xl min-h-screen flex sm:flex-col flex-row items-center sm:py-4 py-2 sm:space-y-6 space-x-4">
      <div className="justify-center">
        <Image
          src="/icons/logo.svg"
          alt="Logo"
          width={32}
          height={32}
          className="mb-10 ml-5"
        />
      </div>

      <div className="flex sm:flex-col flex-row sm:space-y-6 space-x-4 sm:space-x-0">
        {icons.map(({ icon: Icon, href, label }) => {
          const isActive = pathname === href;

          return (
            <Link href={href} key={href}>
              <div
                className={cn(
                  "w-10 h-10 flex items-center justify-center rounded-md hover:bg-indigo-100 transition-all group relative",
                  isActive && "bg-indigo-500 text-white shadow"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 text-gray-500 group-hover:text-indigo-600",
                    isActive && "text-white"
                  )}
                />
                <span className="absolute sm:left-12 left-1/2 sm:top-1/2 top-full sm:-translate-y-1/2 -translate-x-2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all z-10">
                  {label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
