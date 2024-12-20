"use client";

import { type TaskType } from "../types";
import checked from "../../../public/checked.svg";
import unchecked from "../../../public/unchecked.svg";
import trash from "../../../public/trash.svg";
import Image from "next/image";

type TaskProps = {
  task: TaskType;
};

const Task = (props: TaskProps) => {
  const { task } = props;
  const url = process.env.API_BASE_URL || "http://localhost:8000";

  const setCompleted = async () => {
    const completedTask = {
      ...task,
      completed: !task.completed,
    };

    const response = await fetch(`${url}/api/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(completedTask),
    });

    const res = await response.json();
    console.log(res);
  };

  const deleteTask = async () => {
    const response = await fetch(`${url}/api/tasks/${task.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const res = await response.json();
    console.log(res);
  };
  return (
    <div
      className={`flex bg-input w-full p-6 rounded-md border border-lightGray text-sm text-offWhite font-normal gap-4 items-top ${
        task.completed && "line-through !text-graytext"
      }`}
    >
      <Image
        src={task.completed ? checked : unchecked}
        alt="Checkbox"
        width={30}
        height={30}
        className="flex-shrink-0 hover:cursor-pointer"
        onClick={setCompleted}
      />
      {task.title}
      <Image
        src={trash}
        alt="Delete"
        width={30}
        height={30}
        className="flex-shrink-0 ml-auto hover:cursor-pointer"
        onClick={deleteTask}
      />
    </div>
  );
};

export default Task;
