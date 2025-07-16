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
import { cn } from "@/lib/utils"; // optional helper if you have classNames()

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
    <aside className="w-14 bg-[#f9f9fc] min-h-screen flex flex-col items-center py-4 space-y-6 shadow-md">
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
              <span className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all z-10">
                {label}
              </span>
            </div>
          </Link>
        );
      })}
    </aside>
  );
}
