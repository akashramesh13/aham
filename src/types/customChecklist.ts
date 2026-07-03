import { TextInputProps } from "react-native";

export type CustomChecklistProps = {
  checked: boolean;
  value: string;
  onToggle: () => void;
  onValueChange: (text: string) => void;
} & TextInputProps;
