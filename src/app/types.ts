export enum Priority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
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

export type SubmitValues = {
  title: String;
  color: String;
  priority: String;
};

export const toSentenceCase = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
