"use client";

import Button from "./ui/button";
import Image from "next/image";
import { redirect } from "next/navigation";
import plus from "../../../public/plus.svg";

const CreateTaskButton = () => {
  return (
    <Button
      style={{
        transform: "translateY(-50%)",
      }}
      onClick={() => redirect("/create")}
    >
      Create Task
      <Image
        src={plus}
        alt="Plus Icon"
        width={24}
        height={24}
        className="ml-2"
      />
    </Button>
  );
};

export default CreateTaskButton;
