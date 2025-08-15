"use client";

import { useEffect, useState } from "react";
import ReusableForm from "@/components/common/Form";
import Header from "@/components/common/Header";
import Sidebar from "@/components/common/Sidebar";
import { FieldConfig, TaskRole, User } from "@/lib/types";
import { MailIcon } from "lucide-react";
import { fetchUser, updateUser } from "@/lib/api";
import { defaultAvatar } from "@/lib/constants";

const fields: FieldConfig[] = [
  { name: "name", label: "User Name", type: "text" },
  { name: "email", label: "Email", type: "email", icon: <MailIcon size={16} /> },
  { name: "upload", label: "Upload Photo", type: "avatar" },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: [
      "Product Design", "UI/UX Design", "Content Writing", "Copywriting",
      "UX Research", "Market Research", "Product Management", "Project Planning",
      "Development", "QA Testing", "Marketing", "Branding", "Engineering", "Analytics"
    ],
  },
];

export default function SettingsPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [initialForm, setInitialForm] = useState<Partial<User>>({
    name: "",
    email: "",
    role: undefined,
    avatar: "",
  });

  useEffect(() => {
    fetchUser()
      .then((data) => {
        console.log("Fetched user:", data);
        setUserId(data.id);

        setInitialForm({
          name: typeof data.name === "string" ? data.name : "",
          email: typeof data.email === "string" ? data.email : "",
          role: typeof data.role === "string" ? (data.role as TaskRole) : undefined,
          avatar: typeof data.avatar === "string" ? data.avatar : "",
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 bg-gray-50">
        <div className="sticky top-0 z-20 bg-white shadow">
          <Header />
        </div>

        <main className="overflow-y-auto scroll-hidden flex-1">
          <div className="relative">
            <img
              src="https://addo.vn/wp-content/uploads/2021/10/anh-bia-anh-nen-facebook-dep-57-1024x379.jpg"
              alt="Cover"
              className="w-full h-72 object-cover"
            />
            <div className="absolute left-10 -bottom-25">
              <img
                src={initialForm.avatar || defaultAvatar}
                alt="Avatar"
                className="w-40 h-40 rounded-full border-4 border-white shadow-lg"
              />
            </div>
          </div>

          <div className="pt-28 px-15">
            <div className="flex justify-between items-center -mt-25 ml-40 mb-20">
              <h2 className="text-3xl font-bold text-gray-900">Settings</h2>
            </div>

            <div className="flex space-x-10 mb-6 text-gray-600 text-sm font-medium">
              <div className="text-indigo-600">My details</div>
              <div>Profile</div>
              <div>Password</div>
              <div>Team</div>
              <div>Plan</div>
              <div>Billing</div>
              <div>Email</div>
              <div>Notifications</div>
            </div>

            <div className="max-w-2xl w-full -ml-5">
              <ReusableForm
                fields={fields}
                initialValues={initialForm}
                onSubmit={async (formData) => {
                  if (userId === null) {
                    alert("User ID not found.");
                    return;
                  }
                  try {
                    const updatedUser: User = {
                      id: userId,
                      name: typeof formData.name === "string" ? formData.name : "",
                      email: typeof formData.email === "string" ? formData.email : "",
                      avatar: typeof formData.upload === "string" ? formData.upload : "",
                      role:
                        formData.role && formData.role !== ""
                          ? (formData.role as TaskRole)
                          : undefined,
                    };

                    const result = await updateUser(userId, updatedUser);
                    setInitialForm(result);
                    alert("Settings saved successfully!");
                  } catch (err) {
                    console.error(err);
                    alert("Failed to save settings");
                  }
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
