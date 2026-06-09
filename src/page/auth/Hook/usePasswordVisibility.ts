import { useState } from "react";

export const usePasswordVisibility = () => {
  const [passwordVisible, setPasswordVisible] = useState<
    Record<string, boolean>
  >({
    password: false,
    passwordConfirm: false,
  });

  const toggleVisible = (id: string) => {
    setPasswordVisible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return {
    passwordVisible,
    toggleVisible,
  };
};
