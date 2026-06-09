import { useNavigate } from "react-router-dom";
import { useForm } from "./useForm";
import type { SubmitEventHandler } from "react";
import { login } from "../api/authApi";

type LoginForm = {
  userId: string;
  password: string;
};

export default function useLogin() {
  const navigate = useNavigate();
  const { values, handleChange } = useForm<LoginForm>({
    userId: "",
    password: "",
  });

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await login({
        id: values.userId,
        password: values.password,
      });

      alert("로그인 성공했습니다.");
      navigate("/");
    } catch (error) {
      alert(error instanceof Error ? error.message : "로그인에 실패했습니다.");
    }
  };

  return {
    values,
    handleChange,
    handleSubmit,
  };
}
