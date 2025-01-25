"use client";

import Image from "next/image";
import back from "../../../public/back.svg";
import Button from "../components/ui/button";
import plus from "../../../public/plus.svg";
import save from "../../../public/save.svg";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../_api/tasks";
import { colors } from "../util/colors";

const CreatePage = () => {
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    title: "",
    color: "",
    priority: "",
  });

  const [formReady, setFormReady] = useState(false);

  useEffect(() => {
    setFormReady(
      formState.title.trim() !== "" &&
        formState.color !== "" &&
        formState.priority !== ""
    );
  }, [formState]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorSelect = (color: string) => {
    setFormState((prev) => ({ ...prev, color }));
  };

  const handlePrioritySelect = (priority: string) => {
    setFormState((prev) => ({ ...prev, priority }));
  };

  const createMutation = useMutation({
    mutationFn: createTask,
    onMutate: () => {
      setFormReady(false);
      setFormState({
        title: "",
        color: "",
        priority: "",
      });
    },
  });

  return (
    <div className="flex flex-col items-start font-semibold w-1/2 mx-auto my-16 gap-4 text-lightBlue">
      <button className="my-4">
        <Image
          src={back}
          alt="Back Icon"
          height={16}
          width={16}
          onClick={() => redirect("/")}
        />
      </button>
      <label htmlFor="title">Title</label>
      <input
        className="bg-input w-full p-4 rounded-md border border-lightGray text-xs text-offWhite font-normal"
        placeholder="Ex. Comb your hair"
        name="title"
        value={formState.title}
        onChange={handleInputChange}
      ></input>
      <label>Color</label>
      <div className="flex gap-4">
        {Array.from(colors, ([key, value]) => (
          <div
            key={key}
            className={`p-6 rounded-full hover:cursor-pointer ${
              formState.color === key ? "ring-2 ring-offWhite" : ""
            }`}
            style={{ backgroundColor: value }}
            onClick={() => handleColorSelect(key)}
          ></div>
        ))}
      </div>
      <label>Priority</label>
      <div className="flex gap-4 text-offWhite text-sm">
        {["High", "Medium", "Low"].map((priority) => (
          <button
            key={priority}
            className={`border border-lightGray bg-input p-4 px-6 rounded-md ${
              formState.priority === priority
                ? "bg-lightGray text-lightBlue"
                : ""
            }`}
            onClick={() => handlePrioritySelect(priority)}
          >
            {priority}
          </button>
        ))}
      </div>
      <div className="w-full mt-4 text-sm font-medium">
        <Button
          disabled={!formReady}
          onClick={() => createMutation.mutate(formState)}
        >
          {formReady ? (
            <>
              <span>Save</span>
              <Image
                src={save}
                alt="Plus Icon"
                width={24}
                height={24}
                className="ml-2"
              />
            </>
          ) : (
            <>
              <span>Add Task</span>
              <Image
                src={plus}
                alt="Plus Icon"
                width={24}
                height={24}
                className="ml-2"
              />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreatePage;
