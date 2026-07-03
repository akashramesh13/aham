type Option<T extends string> = {
  value: T;
  label: string;
};

export type Props<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: Option<T>[];
};
