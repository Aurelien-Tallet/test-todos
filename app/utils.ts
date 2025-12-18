"use client";
export function formatDate(date: number | string) {
  return new Date(date).toLocaleDateString();
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const API_KEY = process.env.NEXT_PUBLIC_API_SECRET_KEY;

export function validateTodo(todo: { title: string }) {
  return todo.title && todo.title.length > 0;
}

export function sortTodos(
  todos: { id: string; createdAt: number }[],
  order: any
) {
  if (order === "asc") {
    return todos.sort((a, b) => a.createdAt - b.createdAt);
  }
  return todos.sort((a, b) => b.createdAt - a.createdAt);
}
