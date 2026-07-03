import { Task } from "./tasks";

export type TasksSectionProps = {
  title: string;
  value: Task[];
  onChange: (tasks: Task[]) => void;
  allowAdd?: boolean;
};
