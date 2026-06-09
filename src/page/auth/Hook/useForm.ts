import { useState } from "react";

export const useForm = <T extends Record<string, string>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (key: keyof T, value: string) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return {
    values,
    setValues,
    handleChange,
  };
};
