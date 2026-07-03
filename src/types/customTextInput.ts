import { TextInputProps } from "react-native";

export type CustomTextInputProps = {
  value: string;
  onChangeText: (text: string) => void;
} & TextInputProps;
