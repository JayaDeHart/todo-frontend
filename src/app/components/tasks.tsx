"use client";

import { useQuery } from "@tanstack/react-query";
import Task from "./task";
import { Priority, TaskType } from "../types";
import Image from "next/image";
import clipboard from "../../../public/clipboard.svg";
import { getTasks } from "../_api/tasks";
import { colors } from "../create/page";
import { useState } from "react";

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

  const [color, setColor] = useState<string | null>(null);

  const priorityOrder = {
    low: 1,
    medium: 2,
    high: 3,
  };

  const sortedTasksDesc = tasks
    .slice()
    .sort(
      (a, b) =>
        priorityOrder[b.priority.toLowerCase() as keyof typeof priorityOrder] -
        priorityOrder[a.priority.toLowerCase() as keyof typeof priorityOrder]
    );

  const filteredTasks = color
    ? sortedTasksDesc.filter(
        (task) => task.color.toString().toUpperCase() === color.toUpperCase()
      )
    : sortedTasksDesc;

  const completedTasks = filteredTasks.filter((task) => task.completed);

  const handleColorSelect = (key: string) => {
    if (key === color) {
      setColor(null);
    } else {
      setColor(key);
    }
  };

  return (
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

      <div className="flex flex-col w-full gap-4">
        {filteredTasks.map((task) => (
          <Task task={task} key={task.id} />
        ))}
      </div>
    </div>
  );
};

export default Tasks;
