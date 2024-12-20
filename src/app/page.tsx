import Image from "next/image";
import plus from "../../public/plus.svg";
import clipboard from "../../public/clipboard.svg";
import { redirect } from "next/navigation";
import CreateTaskButton from "./components/createTaskButton";
import Task from "./components/task";
import { Color, Priority, TaskType } from "./types";

export default async function Home() {
  const url = process.env.API_BASE_URL || "http://localhost:8000";
  console.log(url + "/api/tasks");

  const tasks = await fetch(url + "/api/tasks");
  const tasksData = await tasks.json();

  const completed = tasksData.filter((task: TaskType) => task.completed);

  const sampleTask: TaskType = {
    title:
      "Sample with lots and lots of text to test the behavior of where it wraps and if it works properly",
    id: 1,
    color: Color.RED,
    priority: Priority.LOW,
    completed: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <div className="flex flex-col items-center font-medium w-1/2 mx-auto">
      <CreateTaskButton />
      <div className="w-full flex justify-between font-semibold my-10">
        <span className="text-lightBlue">
          Tasks{" "}
          <span className="text-gray bg-lightGray p-1 px-3 rounded-xl">
            {tasksData.length}
          </span>
        </span>
        <span className="text-purple">
          Completed{" "}
          <span className="text-gray bg-lightGray p-1 px-3 rounded-xl">
            {completed.length} of {tasksData.length}
          </span>
        </span>
      </div>

      {!tasks && (
        <div
          className="w-full border-t border-l border-r h-1 border-lightGray"
          style={{
            borderRadius: "20px 20px 0px 0px",
          }}
        ></div>
      )}

      {!tasks && (
        <div className="flex flex-col w-full items-center my-10 text-graytext gap-6">
          <Image src={clipboard} alt="Clipboard Icon" width={60} height={60} />
          <p className="font-bold">You don't have any tasks registered yet.</p>
          <p>Create tasks and organize your to-do items.</p>
        </div>
      )}

      <div className="flex flex-col w-full gap-4">
        {tasks &&
          tasksData.map((task: TaskType) => <Task task={task} key={task.id} />)}
        <Task task={sampleTask} />
      </div>
    </div>
  );
}
