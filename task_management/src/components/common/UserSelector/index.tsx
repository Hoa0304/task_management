"use client";

import { User } from "@/lib/types";

interface UserSelectorProps {
  users: User[];
  selectedMembers: User[];
  onChange: (selected: User[]) => void;
}

export default function UserSelector({
  users,
  selectedMembers,
  onChange,
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
          <div
            key={user.id}
            className={`flex items-center justify-between px-3 py-2 border rounded-md cursor-pointer ${
              selected ? "bg-indigo-100 border-indigo-500" : "hover:bg-gray-50"
            }`}
            onClick={() => toggleMember(user)}
          >
            <div>
              <p className="text-sm font-medium">{user.name || user.email}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            {selected && (
              <span className="text-indigo-600 text-xs font-semibold">Selected</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
