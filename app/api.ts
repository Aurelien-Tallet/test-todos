
import { API_URL, API_KEY } from "./utils";

export async function fetchTodos() {
  console.log("Fetching from:", API_URL); 
  console.log("Using API Key:", API_KEY);

  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    {
      id: "1",
      title: "Apprendre React",
      completed: false,
      createdAt: Date.now() - 86400000,
    },
    {
      id: "2",
      title: "Maîtriser Next.js",
      completed: true,
      createdAt: Date.now() - 43200000,
    },
    {
      id: "3",
      title: "Comprendre les anti-patterns",
      completed: false,
      createdAt: Date.now(),
    },
  ];
}

export async function createTodo(title: string) {
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    id: Math.random().toString(),
    title,
    completed: false,
    createdAt: Date.now(),
  };
}

export async function updateTodo(id: string, data: any) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { id, ...data };
}

export async function deleteTodo(id: string) {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return { success: true };
}
