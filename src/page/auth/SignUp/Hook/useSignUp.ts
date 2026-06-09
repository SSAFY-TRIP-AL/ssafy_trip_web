import { useState, type SubmitEventHandler } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../../api/authApi";

export const useSignUp = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState<Record<string, string>>({});

  const handleChange = (id: string, value: string) => {
    setValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const passwordMismatch =
    Boolean(values.passwordConfirm) &&
    values.password !== values.passwordConfirm;

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await signUp({
        id: values.userId,
        name: values.name,
        password: values.password,
        email: values.email,
        phoneNumber: values.phone,
      });

      alert("회원가입이 완료되었습니다.");
      navigate("/auth/login");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "회원가입에 실패했습니다.",
      );
    }
  };

  return {
    values,
    handleChange,
    passwordMismatch,
    handleSubmit,
  };
};
