"use client";

import { useEffect, useState } from "react";
import Board from "@/components/module/Board/Board";
import { Task } from "@/lib/types";
import { fetchTasks } from "@/lib/api";
import Image from "next/image";
import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks()
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="flex w-full">
      <Sidebar />
      <main className="flex-1 bg-gray-50 font-sans">
        <Header />
        <div className="p-6 -mt-5">
          <div className="flex items-center gap-2 text-3xl font-semibold mb-5">
          <Image
            src="/icons/fire.png"
            alt="Logo"
            width={25}
            height={25}
          />
          <div className="text-black font-sans">Task</div>
        </div>
        <Board tasks={tasks} />
        </div>
      </main>
    </div>
  );
}
