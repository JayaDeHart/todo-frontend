import { colors } from "@/app/create/page";
import { Priority, toSentenceCase } from "@/app/types";
import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";
import React from "react";

type TaskSectionProps = {
  id: Priority;
  children: ReactNode;
};

const TaskSection = (props: TaskSectionProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });

  const hasChildren = React.Children.count(props.children) > 0;

  const style = {
    backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='6' ry='6' stroke='%23F2F2F2' stroke-width='2' stroke-dasharray='12%2c 24' stroke-dashoffset='16' stroke-linecap='square'/%3e%3c/svg%3e")`,
    borderRadius: "6px",
  };

  const sectionColors = new Map([
    [Priority.LOW, colors.get("Brown")],
    [Priority.MEDIUM, colors.get("Blue")],
    [Priority.HIGH, colors.get("Orange")],
  ]);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-full gap-4 my-4 p-4 rounded-md ${
        isOver ? "bg-lightGray" : ""
      }`}
      // style={{
      //   border: `1px solid ${sectionColors.get(props.id)}`,
      // }}
    >
      {hasChildren ? (
        props.children
      ) : (
        <div className="flex flex-col w-full gap-4 my-4  h-24 text-offWhite items-center justify-center rounded-md">
          {/* <div>{toSentenceCase(props.id)}</div> */}
        </div>
      )}
    </div>
  );
};

export default TaskSection;
