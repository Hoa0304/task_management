import { Task } from "@/lib/types";
import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { LABEL_COLOR_MAP, PRIORITY_COLOR_MAP } from "@/lib/constants";

export default function TaskCard({ task }: { task: Task }) {
  const labelColor = task.category
    ? LABEL_COLOR_MAP[task.category.toLowerCase()] || "#999"
    : "#999";

  const priorityColor = task.priority
    ? PRIORITY_COLOR_MAP[task.priority.toLowerCase()] || "#999"
    : "#999";

  return (
    <article className="bg-white rounded-2xl shadow p-4 w-full font-sans mb-5">
      {/* Category + Priority */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs text-white h-[22px] px-3 rounded-lg font-medium inline-flex items-center justify-center leading-[20px]"
          style={{ backgroundColor: labelColor }}
        >
          {task.category}
        </span>
        {task.priority && (
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ backgroundColor: priorityColor }}
            title={task.priority}
          />
        )}
      </div>

      {/* Cover image */}
      {task.cover && (
        <Image
          src={task.cover}
          alt={task.title}
          width={400}
          height={200}
          className="w-full h-32 object-cover rounded-xl mb-3"
        />
      )}

      {/* Title */}
      <h3 className="font-medium text-[15px] text-[#232360] mb-0.5">
        {task.title}
      </h3>

      {/* Description */}
      <p className="font-medium text-[14px] text-[#768396] mb-2">
        {task.description}
      </p>

      {/* Date */}
      {task.dueDate && (
        <time className="inline-block border border-[#C4C4C4] text-[11px] text-gray-600 px-2 py-0.5 rounded-md mb-3">
          {task.dueDate}
        </time>
      )}

      {/* avatars + progress */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex -space-x-2">
          {task.members?.slice(0, 3).map((member, index) => (
            <Image
              key={index}
              src={member.avatar}
              alt={member.name}
              width={24}
              height={24}
              className="rounded-full border-2 border-white"
            />
          ))}
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-500">
          <CheckCircle size={16} className="text-gray-400" />
          {task.completed}/{task.total}
        </div>
      </div>
    </article>
  );
}
