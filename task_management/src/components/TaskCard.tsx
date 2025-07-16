import { Task } from "@/lib/types";
import Image from "next/image";

export default function TaskCard({ task }: { task: Task }) {
  return (
    <article className="bg-white rounded-xl shadow p-3 sm:p-4 space-y-2 sm:space-y-3 w-full">
      {task.label && (
        <span className="text-[10px] sm:text-xs bg-[#5051F9] text-white px-2 py-0.5 rounded-lg font-medium inline-block mb-2 sm:mb-3">
          {task.label}
        </span>
      )}
      {task.cover && (
        <Image
          src={task.cover}
          alt={task.title}
          width={300}
          height={160}
          className="w-full h-28 sm:h-32 object-cover rounded-lg"
        />
      )}

      <h3 className="font-semibold text-sm text-gray-800 leading-snug">
        {task.title}
      </h3>
      <p className="text-xs text-gray-500 line-clamp-2">{task.description}</p>
      {task.dueDate && (
        <time className="block text-xs text-gray-400">{task.dueDate}</time>
      )}
    </article>
  );
}
