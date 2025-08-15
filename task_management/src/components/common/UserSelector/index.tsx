"use client";

import { defaultAvatar } from "@/lib/constants";
import { User } from "@/lib/types";

interface UserSelectorProps {
  users: User[];
  selectedMembers: User[];
  onChange: (selected: User[]) => void;
  mode?: "add" | "edit";
}

export default function UserSelector({
  users,
  selectedMembers,
  onChange,
  mode = "add",
}: UserSelectorProps) {
  const toggleMember = (user: User) => {
    const exists = selectedMembers.some((u) => u.id === user.id);
    if (exists) {
      onChange(selectedMembers.filter((u) => u.id !== user.id));
    } else {
      onChange([...selectedMembers, user]);
    }
  };

  return (
    <div className="space-y-2">
      {users.map((user) => {
        const selected = selectedMembers.some((u) => u.id === user.id);
        return (
          <label
            key={user.id}
            className={`flex items-center justify-between px-3 py-2 border rounded-md cursor-pointer ${
              selected ? "bg-indigo-100 border-indigo-500" : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || defaultAvatar}
                alt={user.name || "Avatar"}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium">{user.name || user.email}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={selected}
              onChange={() => toggleMember(user)}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              onClick={(e) => e.stopPropagation()}
            />
          </label>
        );
      })}
    </div>
  );
}
