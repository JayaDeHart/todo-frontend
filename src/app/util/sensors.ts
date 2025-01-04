import {
  MouseSensor as LibMouseSensor,
  TouchSensor as LibTouchSensor,
} from "@dnd-kit/core";
import { MouseEvent, TouchEvent } from "react";

//allows the mouse event to target elements with the 'noDnd' property without dragging them
//used for the complete and delete buttons on the draggable tasks

const handler = ({ nativeEvent: event }: MouseEvent | TouchEvent) => {
  let cur = event.target as HTMLElement;

  while (cur) {
    if (cur.dataset && cur.dataset.noDnd) {
      return false;
    }
    cur = cur.parentElement as HTMLElement;
  }

  return true;
};

export class MouseSensor extends LibMouseSensor {
  static activators = [
    { eventName: "onMouseDown", handler },
  ] as (typeof LibMouseSensor)["activators"];
}

export class TouchSensor extends LibTouchSensor {
  static activators = [
    { eventName: "onTouchStart", handler },
  ] as (typeof LibTouchSensor)["activators"];
}
