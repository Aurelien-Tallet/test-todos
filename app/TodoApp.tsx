"use client";

import { useState, useEffect } from "react";
import { fetchTodos, createTodo, updateTodo, deleteTodo } from "./api";
import { formatDate, sortTodos } from "./utils";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [editingId, setEditingId] = useState<any>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    loadTodos();
  }, []);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  useEffect(() => {
    let result = todos;

    if (filter === "completed") {
      result = result.filter((t) => t.completed);
    } else if (filter === "active") {
      result = result.filter((t) => !t.completed);
    }

    if (searchQuery) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (!showCompleted) {
      result = result.filter((t) => !t.completed);
    }

    result = sortTodos(result, sortOrder);

    setFilteredTodos(result);
  }, [todos, filter, searchQuery, showCompleted, sortOrder]);

  useEffect(() => {
    if (todos.length > 0) {
      console.log("Todos updated:", todos.length);
    }
  }, [todos]);

  useEffect(() => {
    if (error) {
      alert(error);
      setError(null);
    }
  }, [error]);

  async function loadTodos() {
    try {
      setLoading(true);
      const data = await fetchTodos();
      setTodos(data);
    } catch (e) {
      setError((e as any).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTodo(e: React.FormEvent) {
    e.preventDefault();

    if (!newTodoTitle.trim()) {
      setError("Le titre ne peut pas être vide");
      return;
    }

    if (newTodoTitle.length < 3) {
      setError("Le titre doit faire au moins 3 caractères");
      return;
    }

    if (newTodoTitle.length > 100) {
      setError("Le titre ne peut pas dépasser 100 caractères");
      return;
    }

    try {
      const newTodo = await createTodo(newTodoTitle);
      setTodos([...todos, newTodo]);
      setNewTodoTitle("");
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function handleToggleTodo(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      await updateTodo(id, { completed: !todo.completed });
      setTodos(
        todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    } catch (e) {
      setError((e as any).message);
    }
  }

  async function handleDeleteTodo(id: string) {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (e) {
      setError((e as any).message);
    }
  }

  function handleStartEdit(todo: Todo) {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  }

  async function handleSaveEdit() {
    if (!editingTitle.trim()) {
      setError("Le titre ne peut pas être vide");
      return;
    }

    try {
      await updateTodo(editingId!, { title: editingTitle });
      setTodos(
        todos.map((t) =>
          t.id === editingId ? { ...t, title: editingTitle } : t
        )
      );
      setEditingId(null);
      setEditingTitle("");
    } catch (e) {
      setError((e as any).message);
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setEditingTitle("");
  }

  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.filter((t) => !t.completed).length;
  const totalCount = todos.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Ma Todo List
        </h1>

        <div
          className="bg-white rounded-lg shadow-md p-6 mb-6"
          style={{ border: "1px solid #ccc" }}
        >
          <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Nouvelle tâche..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Ajouter
            </button>
          </form>

          {/* Filtres et recherche */}
          <div className="flex flex-wrap gap-4 mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="px-3 py-1 border rounded text-black"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border rounded text-black"
            >
              <option value="all">Toutes</option>
              <option value="active">Actives</option>
              <option value="completed">Terminées</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-1 border rounded text-black"
            >
              <option value="desc">Plus récentes</option>
              <option value="asc">Plus anciennes</option>
            </select>

            <label className="flex items-center gap-2 text-gray-600">
              <input
                type="checkbox"
                checked={showCompleted}
                onChange={(e) => setShowCompleted(e.target.checked)}
              />
              Afficher terminées
            </label>
          </div>

          {/* Stats */}
          <div className="flex gap-4 text-sm text-gray-600 mb-4">
            <span>Total: {totalCount}</span>
            <span>Actives: {activeCount}</span>
            <span>Terminées: {completedCount}</span>
          </div>
        </div>

        {/* Liste des todos */}
        <div className="space-y-2">
          {filteredTodos.map((todo, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow p-4 flex items-center gap-4"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(todo.id)}
                className="w-5 h-5"
              />

              {editingId === todo.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    className="flex-1 px-2 py-1 border rounded text-black"
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Sauver
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-500 text-white rounded"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className={`flex-1 ${
                      todo.completed
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {todo.title}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(todo.createdAt)}
                  </span>
                  <button
                    onClick={() => handleStartEdit(todo)}
                    className="px-3 py-1 bg-yellow-500 text-white rounded text-sm"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Supprimer
                  </button>
                </>
              )}
            </div>
          ))}

          {filteredTodos.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Aucune tâche trouvée
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
