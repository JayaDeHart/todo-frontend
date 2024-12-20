"use client";

import Image from "next/image";
import back from "../../../public/back.svg";
import Button from "../components/ui/button";
import plus from "../../../public/plus.svg";

const CreatePage = () => {
  const colors = new Map([
    ["Red", "#FF3B30"],
    ["Orange", "#FF9500"],
    ["Yellow", "#FFCC00"],
    ["Green", "#34C759"],
    ["Blue", "#007AFF"],
    ["Indigo", "#5856D6"],
    ["Purple", "#AF52DE"],
    ["Pink", "#FF2D55"],
    ["Brown", "#A2845E"],
  ]);

  const selectColor = () => {
    console.log("hi");
  };

  return (
    <div className="flex flex-col items-start font-semibold w-1/2 mx-auto my-16 gap-4 text-lightBlue">
      <button className="my-4">
        <Image src={back} alt="Back Icon" height={16} width={16} />
      </button>
      <label htmlFor="title">Title</label>
      <input
        className="bg-input w-full p-4 rounded-md border border-lightGray text-xs text-offWhite font-normal"
        placeholder="Ex. Comb your hair"
        name="title"
      ></input>
      <label>Color</label>
      <div className="flex gap-4">
        {Array.from(colors, ([key, value]) => (
          <div
            key={key}
            className="p-6 rounded-full hover:cursor-pointer"
            style={{ backgroundColor: value }}
          ></div>
        ))}
      </div>
      <label>Priority</label>
      <div className="flex gap-4 text-offWhite text-sm">
        <button className="border border-lightGray bg-input p-4 px-6 rounded-md">
          High
        </button>
        <button className="border border-lightGray bg-input p-4 px-6 rounded-md">
          Medium
        </button>
        <button className="border border-lightGray bg-input p-4 px-6 rounded-md">
          Low
        </button>
      </div>
      <div className="w-full mt-4 text-sm font-medium">
        <Button onClick={selectColor}>
          Add Task
          <Image
            src={plus}
            alt="Plus Icon"
            width={24}
            height={24}
            className="ml-2"
          />
        </Button>
      </div>
    </div>
  );
};

export default CreatePage;
