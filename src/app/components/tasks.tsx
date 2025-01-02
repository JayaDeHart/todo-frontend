"use client";

import { useQuery } from "@tanstack/react-query";
import Task from "./task";
import { Priority, TaskType } from "../types";
import Image from "next/image";
import clipboard from "../../../public/clipboard.svg";
import { getTasks } from "../_api/tasks";
import { colors } from "../create/page";
import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  DropAnimation,
  defaultDropAnimation,
  DropAnimationFunction,
} from "@dnd-kit/core";
import TaskSection from "./ui/taskSection";
import { DragEndEvent } from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../_api/tasks";
import { MouseSensor, TouchSensor } from "../util/draggable";
import { DragOverEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { GSP_NO_RETURNED_VALUE } from "next/dist/lib/constants";

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

    onMutate: (updatedTask) => {
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
  const [tasksByPriority, setTasksByPriority] = useState<
    Record<string, TaskType[]>
  >({
    LOW: [],
    MEDIUM: [],
    HIGH: [],
  });

  const [pristine, setPristine] = useState(true);

  useEffect(() => {
    console.log(pristine);
    if (tasks && pristine) {
      setTasksByPriority({
        LOW: filteredTasks.filter((task) => task.priority === "LOW"),
        MEDIUM: filteredTasks.filter((task) => task.priority === "MEDIUM"),
        HIGH: filteredTasks.filter((task) => task.priority === "HIGH"),
      });
    }
    setPristine(true);
  }, [tasks, color]);

  const handleColorSelect = (key: string) => {
    if (key === color) {
      setColor(null);
    } else {
      setColor(key);
    }
  };

  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  function handleDragStart(event: DragStartEvent) {
    if (tasks) {
      const task = tasks.find(
        (t) => t.id === Number(event.active.id.toString())
      );
      if (task) {
        //filter out the active task from the appropriate section
        setTasksByPriority((prev) => ({
          ...prev,
          [task.priority]: prev[task.priority].filter((t) => t.id !== task.id),
        }));

        setActiveTask(task);
      }
    }
  }

  const handleDragOver = (e: DragOverEvent) => {};

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = e;

    if (!active) {
      return;
    }

    const oldTask = tasks.find((t) => t.id === Number(active.id));

    if (!oldTask) {
      return;
    }

    if (!over) {
      setTasksByPriority((prev) => {
        const temp = { ...prev };

        temp[oldTask.priority] = [...temp[oldTask.priority], oldTask];
        return temp;
      });
      return;
    }

    if (over.id === oldTask.priority) {
      setTasksByPriority((prev) => {
        const temp = { ...prev };
        temp[oldTask.priority] = [...temp[oldTask.priority], oldTask];
        return temp;
      });
      return;
    }

    //over can either be a droppable container or a draggable element
    if (typeof over.id === "string") {
      //typeof string means we are over a droppable container
      if (oldTask) {
        const newTask: TaskType = {
          ...oldTask,
          priority: over.id as Priority,
        };
        updateTaskMutation.mutate(newTask);
      }
    }
    if (typeof over.id === "number") {
      //typeof number means we are over another draggable element
      //find that element
      const overTask = tasks.find((t) => t.id === Number(over.id));
      if (!overTask) {
        return;
      }
      if (e.collisions) {
        const containerCollision = e.collisions.find(
          (c) => typeof c.id === "string"
        );
        if (containerCollision) {
          const newContainer = containerCollision.id;
          //assign it to the new container, AND move the array position

          setTasksByPriority((prev) => {
            const temp = { ...prev };
            if (!e.over) return temp;

            temp[newContainer] = [...temp[newContainer], oldTask];

            const oldIdx = temp[newContainer].indexOf(oldTask);
            const newIdx = temp[newContainer].indexOf(overTask);
            temp[newContainer] = arrayMove(temp[newContainer], oldIdx, newIdx);
            return temp;
          });

          setPristine(false);

          const newTask: TaskType = {
            ...oldTask,
            priority: newContainer as Priority,
          };
          updateTaskMutation.mutate(newTask);
        }
      }
    }
  };

  const mouseSensor = useSensor(MouseSensor);
  const sensors = useSensors(mouseSensor);

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
      <div className="absolute left-10 right-10 xl:left-52 xl:right-52 flex gap-2">
        <DndContext
          onDragEnd={handleDragEnd}
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
        >
          <TaskSection id={Priority.LOW} items={tasksByPriority.LOW}>
            {tasksByPriority.LOW.map((task) => (
              <Task task={task} key={task.id} />
            ))}
          </TaskSection>
          <TaskSection id={Priority.MEDIUM} items={tasksByPriority.MEDIUM}>
            {tasksByPriority.MEDIUM.map((task) => (
              <Task task={task} key={task.id} />
            ))}
          </TaskSection>
          <TaskSection id={Priority.HIGH} items={tasksByPriority.HIGH}>
            {tasksByPriority.HIGH.map((task) => (
              <Task task={task} key={task.id} />
            ))}
          </TaskSection>

          <DragOverlay>
            {activeTask ? <Task task={activeTask} hide={false} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default Tasks;
