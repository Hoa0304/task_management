"use client";

import { TaskStatus } from "@/lib/types";
import { MoreHorizontal, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Status({
  title,
  onAdd,
  onEdit,
}: {
  title: TaskStatus;
  onAdd: () => void;
  onEdit?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center justify-between mb-4 p-3 bg-white shadow rounded-xl">
      <h2 className="text-sm sm:text-base font-semibold text-[#1D1E25]">{title}</h2>
      <div className="flex items-center gap-2">
        <div className="relative" ref={menuRef}>
          <button onClick={() => setMenuOpen((prev) => !prev)}>
            <MoreHorizontal className="w-5 h-5 text-[#768396]" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 w-40 bg-white shadow-lg rounded-md py-2 z-50 border-2 border-[#5051F9]">
              <div className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span> High Priority
              </div>
              <div className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span> Medium Priority
              </div>
              <div className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500"></span> Low Priority
              </div>
              {onEdit && (
                <div
                  onClick={() => {
                    onEdit();
                    setMenuOpen(false);
                  }}
                  className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  ✏️ Edit
                </div>
              )}
            </div>
          )}
        </div>

        <button
          onClick={onAdd}
          className="bg-indigo-100 p-1 rounded-md hover:bg-indigo-200 transition-colors"
        >
          <Plus className="w-4 h-4 text-indigo-600" />
        </button>
      </div>
    </div>
  );
}
