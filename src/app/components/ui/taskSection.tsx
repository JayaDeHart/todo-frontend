import { colors } from "@/app/create/page";
import { Priority, TaskType, toSentenceCase } from "@/app/types";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { ReactNode } from "react";
import React from "react";

type TaskSectionProps = {
  id: Priority;
  children: ReactNode;
  items: TaskType[];
};

const TaskSection = (props: TaskSectionProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });

  return (
    <SortableContext
      id={props.id}
      items={props.items}
      strategy={verticalListSortingStrategy}
    >
      <div
        ref={setNodeRef}
        className={`flex flex-col w-full gap-4 my-4 p-4 rounded-md pb-24 ${
          isOver ? "bg-lightGray" : ""
        }`}
      >
        <h2 className="text-lightBlue text-center font-semibold">
          {toSentenceCase(props.id)}
        </h2>
        {props.children}
      </div>
    </SortableContext>
  );
};

export default TaskSection;
