"use client";

import { toSentenceCase, type TaskType } from "../types";
import checked from "../../../public/checked.svg";
import unchecked from "../../../public/unchecked.svg";
import trash from "../../../public/trash.svg";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask, updateTask } from "../_api/tasks";
import { colors } from "../create/page";
import { DragOverlay, useDraggable } from "@dnd-kit/core";

type TaskProps = {
  task: TaskType;
};

const Task = (props: TaskProps) => {
  const { task } = props;
  const color = colors.get(toSentenceCase(task.color.toString()));
  const queryClient = useQueryClient();

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onMutate: async (updatedTask) => {
      queryClient.setQueryData<TaskType[]>(["tasks"], (oldData) =>
        oldData?.map((task) => {
          if (task.id === updatedTask.id) {
            return updatedTask;
          } else {
            return task;
          }
        })
      );
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onMutate: async (id) => {
      queryClient.setQueryData<TaskType[]>(["tasks"], (oldData) =>
        oldData?.filter((task) => task.id !== id)
      );
    },
  });

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id.toString(),
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      className="rounded-md"
      style={{ borderTop: `1px solid ${color}`, ...style }}
      {...listeners}
      {...attributes}
    >
      <div
        className={`flex bg-input w-full p-6 rounded-md border border-lightGray text-sm text-offWhite font-normal gap-4 items-top ${
          task.completed && "line-through !text-graytext"
        }`}
      >
        <Image
          data-no-dnd="true"
          src={task.completed ? checked : unchecked}
          alt="Checkbox"
          width={30}
          height={30}
          className="flex-shrink-0 hover:cursor-pointer"
          onClick={() =>
            updateTaskMutation.mutate({
              ...task,
              completed: !task.completed,
            })
          }
        />
        <div className="flex-1">{task.title}</div>
        <div className="border border-lightGray bg-medGray flex-shrink-0 ml-auto p-2 px-4 rounded-md">
          {toSentenceCase(task.priority.toString())}
        </div>
        <Image
          src={trash}
          alt="Delete"
          width={30}
          height={30}
          className="flex-shrink-0 ml-auto hover:cursor-pointer"
          onClick={() => deleteTaskMutation.mutate(task.id)}
          data-no-dnd="true"
        />
      </div>
    </div>
  );
};

export default Task;
