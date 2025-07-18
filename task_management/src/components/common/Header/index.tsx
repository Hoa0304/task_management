"use client";

import { useEffect, useState } from "react";
import { Bell, ChevronDown, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchTasks } from "@/lib/api";
import { Task } from "@/lib/types";

export default function Header() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Task[]>([]);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadTasks() {
      try {
        const tasks = await fetchTasks();
        setAllTasks(tasks);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    }
    loadTasks();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = allTasks.filter((task) =>
  task.title?.toLowerCase().includes(value.toLowerCase())
);
setSearchResults(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="font-sans flex items-center bg-white justify-between mb-6 px-4 relative z-50">
      <div className="flex-1 flex justify-center p-5">
        <div className="relative w-[98%] max-w-xs">
          <input
            type="text"
            placeholder="Search anything..."
            value={searchTerm}
            onChange={handleSearch}
            className="font-regular w-full pl-4 pr-10 py-2 rounded-lg bg-[#F3F7FA] text-sm text-[#23235F] placeholder:text-[#23235F] focus:outline-none"
          />
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#94A2BC]" />

          {searchResults.length > 0 && (
            <ul className="absolute left-0 right-0 mt-2 bg-white border-2 border-[#E5E5ED] rounded-md shadow-lg z-50 max-h-48 overflow-y-auto scroll-hidden">
              {searchResults.map((task) => (
                <li
                  key={task.id}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                >
                  {task.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mr-3 relative">
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

        <div className="relative">
          <ChevronDown
            className="w-4 h-4 text-[#5250F9] font-bold cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-5 w-32 bg-white border border-[#5250F9] shadow-md rounded-md z-50">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:rounded-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
