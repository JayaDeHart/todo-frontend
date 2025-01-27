"use client";

import { useQuery } from "@tanstack/react-query";
import Task from "./task";
import { Priority, TaskType } from "../types";
import Image from "next/image";
import clipboard from "../../../public/clipboard.svg";
import { getTasks } from "../_api/tasks";
import { useState, useEffect, useMemo } from "react";
import { colors } from "../util/colors";
import {
  DndContext,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import TaskSection from "./ui/taskSection";
import { DragEndEvent } from "@dnd-kit/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "../_api/tasks";
import { MouseSensor } from "../util/sensors";
import { DragOverEvent } from "@dnd-kit/core";
import {
  appendToContainer,
  removeFromContainer,
  reorderTaskInContainer,
  replaceWithPlaceholder,
} from "../util/dragHandlerUtils";

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

  //state
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [pristine, setPristine] = useState(true);
  const [tasksByPriority, setTasksByPriority] = useState<
    Record<string, TaskType[]>
  >({
    LOW: [],
    MEDIUM: [],
    HIGH: [],
  });

  //react query
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

  const filteredTasks = useMemo(() => {
    return color
      ? tasks.filter(
          (task) => task.color.toString().toUpperCase() === color.toUpperCase()
        )
      : tasks;
  }, [tasks, color]);

  const completedTasks = useMemo(() => {
    return filteredTasks.filter((task) => task.completed);
  }, [filteredTasks]);

  useEffect(() => {
    if (tasks && pristine) {
      setTasksByPriority({
        LOW: filteredTasks.filter((task) => task.priority === "LOW"),
        MEDIUM: filteredTasks.filter((task) => task.priority === "MEDIUM"),
        HIGH: filteredTasks.filter((task) => task.priority === "HIGH"),
      });
    }
    setPristine(true);
  }, [tasks, color]);

  //handlers

  const handleColorSelect = (key: string) => {
    if (key === color) {
      setColor(null);
    } else {
      setColor(key);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    if (tasks) {
      const task = tasks.find(
        (t) => t.id === Number(event.active.id.toString())
      );
      if (task) {
        //replacing the active task with an invisible placeholder that holds its place = nicer visual behavior
        setTasksByPriority((prev) => replaceWithPlaceholder(prev, task));
        setActiveTask(task);
      }
    }
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!active) {
      return;
    }
    const task = tasks.find((t) => t.id === Number(active.id));
    if (!task) {
      return;
    }
    const placeholder = tasksByPriority[task.priority].find(
      (t) => t.placeholder
    );
    if (!placeholder) {
      return;
    }
    if (!over) {
      setTasksByPriority((prev) => removeFromContainer(prev, placeholder));
      return;
    }
    if (String(over.id) !== String(task.priority)) {
      setTasksByPriority((prev) => removeFromContainer(prev, placeholder));
    }
  };

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

    const placeholder = tasksByPriority[oldTask.priority].find(
      (t) => t.placeholder
    );

    if (placeholder) {
      setTasksByPriority((prev) => removeFromContainer(prev, placeholder));
    }

    if (!over) {
      setTasksByPriority((prev) => appendToContainer(prev, oldTask));
      return;
    }

    if (over.id === oldTask.priority) {
      setTasksByPriority((prev) => appendToContainer(prev, oldTask));
      return;
    }

    //over can either be a droppable container or a draggable element
    if (typeof over.id === "string") {
      //typeof string means we are over a droppable container

      const newTask: TaskType = {
        ...oldTask,
        priority: over.id as Priority,
      };
      setPristine(false);
      setTasksByPriority((prev) => appendToContainer(prev, newTask));
      updateTaskMutation.mutate(newTask);
      setPristine(true);
    }
    if (typeof over.id === "number") {
      //typeof number means we are over another draggable element

      const overTask = tasks.find((t) => t.id === Number(over.id));

      if (!overTask || !e.collisions) {
        return;
      }

      const containerCollision = e.collisions.find(
        (c) => typeof c.id === "string"
      );

      if (!containerCollision) {
        return;
      }

      const newContainer = containerCollision.id;
      //assign it to the new container, AND move the array position

      setTasksByPriority((prev) =>
        reorderTaskInContainer(prev, oldTask, overTask, String(newContainer))
      );

      setPristine(false);

      if (String(newContainer) !== oldTask.priority) {
        const newTask: TaskType = {
          ...oldTask,
          priority: newContainer as Priority,
        };
        updateTaskMutation.mutate(newTask);
      }
      setPristine(true);
    }
  };

  //sensors
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
        {tasks.length > 0 && (
          <DndContext
            onDragEnd={handleDragEnd}
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
          >
            <TaskSection id={Priority.LOW} items={tasksByPriority.LOW}>
              {tasksByPriority.LOW.map((task) => (
                <Task
                  task={task}
                  key={task.id}
                  placeholder={task.placeholder}
                />
              ))}
            </TaskSection>
            <TaskSection id={Priority.MEDIUM} items={tasksByPriority.MEDIUM}>
              {tasksByPriority.MEDIUM.map((task) => (
                <Task
                  task={task}
                  key={task.id}
                  placeholder={task.placeholder}
                />
              ))}
            </TaskSection>
            <TaskSection id={Priority.HIGH} items={tasksByPriority.HIGH}>
              {tasksByPriority.HIGH.map((task) => (
                <Task
                  task={task}
                  key={task.id}
                  placeholder={task.placeholder}
                />
              ))}
            </TaskSection>

            <DragOverlay>
              {activeTask ? <Task task={activeTask} /> : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default Tasks;
