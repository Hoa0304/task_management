"use client";

import { useEffect, useState } from "react";
import Board from "@/components/module/Board/Board";
import { Task } from "@/lib/types";
import { fetchTasks, generateTask } from "@/lib/api";
import Image from "next/image";
import Sidebar from "@/components/common/Sidebar";
import Header from "@/components/common/Header";
import { motion } from "framer-motion";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [prompt, setPrompt] = useState("");

  const loadTasks = () => {
    setLoading(true);
    fetchTasks()
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleGenerateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const data = await generateTask(
        prompt || "Generate a task for today with realistic values"
      );

      if (data && data.title) {
        const newTask: Task = {
          id: Date.now(),
          title: data.title,
          description: data.description || "",
          status: "To Do",
        };
        setTasks((prev) => [...prev, newTask]);
        setShowForm(false);
        setPrompt("");
      } else {
        console.error("Invalid task format from Gemini", data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="flex w-full">
      <Sidebar />
      <main className="flex-1 bg-gray-50 font-sans">
        <Header />
        <div className="p-6 -mt-5">
          <div className="flex items-center gap-3 mb-5">
            <motion.div
              animate={{
                rotate: [0, 8, -8, 0],
                y: [0, -2, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                ease: "easeInOut"
              }}
            >
              <Image
                src="/icons/fire.png"
                alt="Logo"
                width={25}
                height={25}
              />
            </motion.div>
            <div className="text-3xl font-semibold text-black font-sans">
              Task
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="ml-auto px-3 py-1.5 text-sm text-white rounded shadow-md hover:opacity-90 transition animated-gradient"
            >
              Generate Task with AI
            </button>

            <style jsx>{`
              .animated-gradient {
                background: linear-gradient(
                  270deg,
                  #fcc5e4,
                  #fda34b,
                  #ff7882,
                  #c8699e,
                  #7046aa,
                  #0c1db8,
                  #020f75
                );
                background-size: 1400% 1400%;
                animation: gradientMove 2s ease infinite;
              }

              @keyframes gradientMove {
                0% {
                  background-position: 0% 50%;
                }
                50% {
                  background-position: 100% 50%;
                }
                100% {
                  background-position: 0% 50%;
                }
              }
            `}</style>
          </div>
          <Board tasks={tasks} />
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-[0_10px_50px_rgba(82,80,249,0.4)] w-full max-w-md border-[2px] border-[#5250F9]">
              <h2 className="text-xl font-semibold mb-4">Generate Task with AI</h2>
              <form onSubmit={handleGenerateTask} className="space-y-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter a description or request for the task..."
                  className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
                  rows={4}
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-3 py-1.5 text-sm bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={generating}
                    className="px-3 py-1.5 text-sm bg-[#5250F9] text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                  >
                    {generating ? "Generating..." : "Generate"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
