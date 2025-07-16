import Board from "@/components/Board";
import { Task } from "@/lib/types";

const sampleTasks: Task[] = [
  {
    id: 1,
    title: "Create styleguide foundation",
    description: "Create content for pecland App",
    status: "Backlog",
    dueDate: "Aug 20, 2021",
    label: "Design",
    cover: "/images/stylebg.png",
  },
  {
    id: 2,
    title: "Copywriting Content",
    description: "Create content for pecland App",
    status: "Backlog",
    dueDate: "Aug 20, 2021",
    label: "Research",
  },
];

export default function TasksPage() {
  return (
    <main className="p-6">
      <Board tasks={sampleTasks} />
    </main>
  );
}
