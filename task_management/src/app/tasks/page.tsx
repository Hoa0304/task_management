import Board from "@/components/Board";
import { Task } from "@/lib/types";

const sampleTasks: Task[] = [
  {
    id: 1,
    title: "Create styleguide foundation",
    description: "Create content for peceland App",
    status: "Backlog",
    dueDate: "Aug 20, 2021",
    label: "Design",
    cover: "/images/stylebg.png",
    members: [
      { name: "Alice", avatar: "/icons/logo.svg" },
      { name: "Bob", avatar: "/icons/logo.svg" },
      { name: "Eve", avatar: "/icons/logo.svg" }
    ],
    completed: 0,
    total: 8
  },
  {
    id: 2,
    title: "Copywriting Content",
    description: "Create content for pecland App",
    status: "Backlog",
    dueDate: "Aug 20, 2021",
    label: "Research",
    members: [
      { name: "Alice", avatar: "/icons/logo.svg" },
      { name: "Bob", avatar: "/icons/logo.svg" },
      { name: "Eve", avatar: "/icons/logo.svg" }
    ],
    completed: 0,
    total: 8
  },
     {
    id: 3,
    title: "Create styleguide foundation",
    description: "Create content for peceland App",
    status: "To Do",
    dueDate: "Aug 20, 2021",
    label: "Content",
    cover: "/images/stylebg.png",
    members: [
      { name: "Alice", avatar: "/icons/logo.svg" },
      { name: "Bob", avatar: "/icons/logo.svg" },
      { name: "Eve", avatar: "/icons/logo.svg" }
    ],
    completed: 0,
    total: 8
  },
   {
    id: 7,
    title: "Create styleguide foundation",
    description: "Create content for peceland App",
    status: "To Do",
    dueDate: "Aug 20, 2021",
    label: "Content",
    cover: "/images/stylebg.png",
    members: [
      { name: "Alice", avatar: "/icons/logo.svg" },
      { name: "Bob", avatar: "/icons/logo.svg" },
      { name: "Eve", avatar: "/icons/logo.svg" }
    ],
    completed: 0,
    total: 8
  },
];

export default function TasksPage() {
  return (
    <main className="p-6">
      <Board tasks={sampleTasks} />
    </main>
  );
}
