import { Task } from "./tasks";

export type TasksCardProps = {
  todayTasks: Task[];
  carriedOverTasks: Task[];
  onTodayTasksChange: (tasks: Task[]) => void;
  onCarriedOverTasksChange: (tasks: Task[]) => void;
};