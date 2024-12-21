"use client";

import { useQuery } from "@tanstack/react-query";
import Task from "./task";
import { Priority, TaskType } from "../types";
import Image from "next/image";
import clipboard from "../../../public/clipboard.svg";
import { getTasks } from "../_api/tasks";
import { colors } from "../create/page";
import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  DropAnimation,
} from "@dnd-kit/core";
import TaskSection from "./ui/taskSection";
import { DragEndEvent } from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../_api/tasks";
import { MouseSensor, TouchSensor } from "../util/draggable";

const Tasks = () => {
  const {
    data: tasks,
    isLoading,
    isError,
  } = useQuery<TaskType[]>({
    queryKey: ["tasks"],
    queryFn: () => getTasks(),
  });

  if (isLoading) {
    return <p>Loading tasks...</p>;
  }

  if (isError || !tasks) {
    return <p>Error loading tasks</p>;
  }

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

  const [color, setColor] = useState<string | null>(null);

  const filteredTasks = color
    ? tasks.filter(
        (task) => task.color.toString().toUpperCase() === color.toUpperCase()
      )
    : tasks;

  const completedTasks = filteredTasks.filter((task) => task.completed);

  let highs = filteredTasks.filter((task) => task.priority === "HIGH");

  let mediums = filteredTasks.filter((task) => task.priority === "MEDIUM");

  let lows = filteredTasks.filter((task) => task.priority === "LOW");

  const handleColorSelect = (key: string) => {
    if (key === color) {
      setColor(null);
    } else {
      setColor(key);
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const taskId = e.active.id;
    const priority = e.over?.id as string;
    const task = tasks.find((t) => t.id === Number(taskId));

    if (
      task &&
      priority &&
      Object.values(Priority).includes(priority as Priority) &&
      task.priority !== priority
    ) {
      const newTask: TaskType = {
        ...task,
        priority: priority as Priority,
      };

      updateTaskMutation.mutate(newTask);
    }
  };

  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  function handleDragStart(event: DragStartEvent) {
    if (tasks) {
      const task = tasks.find(
        (t) => t.id === Number(event.active.id.toString())
      );
      if (task) {
        setActiveTask(task);
      }
    }
  }

  const mouseSensor = useSensor(MouseSensor);
  const sensors = useSensors(mouseSensor);

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      sensors={sensors}
      onDragStart={handleDragStart}
    >
      <div className="w-full">
        <div className="w-full flex justify-between font-semibold mt-10 mb-10">
          <span className="text-lightBlue">
            Tasks{" "}
            <span className="text-gray bg-lightGray p-1 px-3 rounded-xl">
              {filteredTasks.length}
            </span>
          </span>

          <span className="text-purple">
            Completed{" "}
            <span className="text-gray bg-lightGray p-1 px-3 rounded-xl">
              {completedTasks.length} of {filteredTasks.length}
            </span>
          </span>
        </div>

        {tasks.length ? (
          <div className="mt-4 mb-10 flex justify-center gap-4">
            <p className="text-purple text-center font-semibold">Filter</p>
            {Array.from(colors, ([key, value]) => (
              <div
                key={key}
                className={`p-3 rounded-full hover:cursor-pointer ${
                  color === key ? "ring-2 ring-offWhite" : ""
                }`}
                style={{ backgroundColor: value }}
                onClick={() => handleColorSelect(key)}
              ></div>
            ))}
          </div>
        ) : null}

        {tasks.length === 0 && (
          <>
            <div
              className="w-full border-t border-l border-r h-1 border-lightGray"
              style={{
                borderRadius: "20px 20px 0px 0px",
              }}
            ></div>
            <div className="flex flex-col w-full items-center my-10 text-graytext gap-6">
              <Image
                src={clipboard}
                alt="Clipboard Icon"
                width={60}
                height={60}
              />
              <p className="font-bold">
                You don't have any tasks registered yet.
              </p>
              <p>Create tasks and organize your to-do items.</p>
            </div>
          </>
        )}

        <TaskSection id={Priority.HIGH}>
          {highs.map((task) => (
            <Task task={task} key={task.id} />
          ))}
        </TaskSection>
        <TaskSection id={Priority.MEDIUM}>
          {mediums.map((task) => (
            <Task task={task} key={task.id} />
          ))}
        </TaskSection>
        <TaskSection id={Priority.LOW}>
          {lows.map((task) => (
            <Task task={task} key={task.id} />
          ))}
        </TaskSection>
        {/* it was very difficult to get the drop animation working with how react query handles state. It is one thing I would love to go back and figure out given more time */}
        <DragOverlay dropAnimation={null}>
          {activeTask ? <Task task={activeTask} /> : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default Tasks;
