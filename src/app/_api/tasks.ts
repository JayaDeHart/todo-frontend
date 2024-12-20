import { SubmitValues, TaskType } from "../types";

const URL = process.env.API_BASE_URL || "http://localhost:8000";

export const getTasks = async () => {
  const tasks = await fetch(URL + "/api/tasks");
  const tasksData = await tasks.json();
  return tasksData;
};

export const updateTask = async (updatedTask: TaskType) => {
  const response = await fetch(`${URL}/api/tasks/${updatedTask.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTask),
  });
  if (!response.ok) throw new Error("Failed to update task");
  return response.json();
};

export const deleteTask = async (id: number) => {
  const response = await fetch(`${URL}/api/tasks/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Failed to delete task");
  return response.json();
};

export const createTask = async (task: SubmitValues) => {
  const response = await fetch(`${URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });
  if (!response.ok) throw new Error("Failed to delete task");
  return response.json();
};
