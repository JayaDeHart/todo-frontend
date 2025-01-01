import { colors } from "@/app/create/page";
import { Priority, toSentenceCase } from "@/app/types";
import { useDroppable } from "@dnd-kit/core";
import { ReactNode } from "react";
import React from "react";

type SortableSectionProps = {
  id: string;
  children: ReactNode;
};

const SortableSection = (props: SortableSectionProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "sortable" + props.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-full gap-4 my-4 p-4 rounded-md ${
        isOver ? "bg-lightGray" : ""
      }`}
    >
      {props.children}
    </div>
  );
};

export default SortableSection;
