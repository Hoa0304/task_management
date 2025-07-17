"use client";

import { useEffect, useState } from "react";
import Board from "@/components/Board";
import { Task } from "@/lib/types";
import { fetchTasks } from "@/lib/api";

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
    <main className="p-6">
      <Board tasks={tasks} />
    </main>
  );
}
