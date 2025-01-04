import { TaskType } from "../types";
import { arrayMove } from "@dnd-kit/sortable";

export const reorderTaskInContainer = (
  prev: Record<string, TaskType[]>,
  oldTask: TaskType,
  overTask: TaskType,
  newContainer: string
) => {
  const temp = { ...prev };
  temp[newContainer] = [...temp[newContainer], oldTask];

  const oldIdx = temp[newContainer].indexOf(oldTask);
  const newIdx = temp[newContainer].indexOf(overTask);
  temp[newContainer] = arrayMove(temp[newContainer], oldIdx, newIdx);

  return temp;
};

export const appendToContainer = (
  prev: Record<string, TaskType[]>,
  newTask: TaskType
) => {
  const temp = { ...prev };
  temp[newTask.priority] = [...temp[newTask.priority], newTask];
  return temp;
};

export const removeFromContainer = (
  prev: Record<string, TaskType[]>,
  task: TaskType
) => {
  return {
    ...prev,
    [task.priority]: prev[task.priority].filter((t) => t.id !== task.id),
  };
};

export const replaceWithPlaceholder = (
  prev: Record<string, TaskType[]>,
  task: TaskType
) => {
  const temp = { ...prev };
  const index = temp[task.priority].indexOf(task);

  temp[task.priority][index] = { ...task, placeholder: true, id: 9000 };
  return temp;
};
