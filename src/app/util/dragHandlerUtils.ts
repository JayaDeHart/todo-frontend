import { TaskType } from "../types";
import { arrayMove } from "@dnd-kit/sortable";

export const reorderTaskInContainer = (
  tasksByPriority: Record<string, TaskType[]>,
  oldTask: TaskType,
  overTask: TaskType,
  newContainer: string
) => {
  const temp = { ...tasksByPriority };
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
