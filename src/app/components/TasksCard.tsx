import { TasksCardProps } from "@/types/tasksCardProps";
import { View } from "react-native";
import TasksSection from "./TasksSection";

const TasksCard = ({
  todayTasks,
  onTodayTasksChange,
  carriedOverTasks,
  onCarriedOverTasksChange,
}: TasksCardProps) => {
  return (
    <View>
      <TasksSection
        title="Today's Tasks"
        value={todayTasks}
        onChange={onTodayTasksChange}
        allowAdd
      />

      {carriedOverTasks.length > 0 && (
        <TasksSection
          title="Carried Over"
          value={carriedOverTasks}
          onChange={onCarriedOverTasksChange}
        />
      )}
    </View>
  );
};

export default TasksCard;
