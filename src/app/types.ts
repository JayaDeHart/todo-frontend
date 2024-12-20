export enum Priority {
  LOW,
  MEDIUM,
  HIGH,
}

export enum Color {
  RED,
  ORANGE,
  YELLOW,
  GREEN,
  BLUE,
  INDIGO,
  PURPLE,
  PINK,
  BROWN,
}

export type TaskType = {
  id: number;
  title: String;
  color: Color;
  priority: Priority;
  completed: Boolean;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
};
