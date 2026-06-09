import { type SubmitEventHandler } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../api/authApi";
import { useForm } from "./useForm";

type SignUpForm = {
  userId: string;
  name: string;
  password: string;
  passwordConfirm: string;
  email: string;
  phone: string;
};

export const useSignUp = () => {
  const navigate = useNavigate();
  const { values, handleChange } = useForm<SignUpForm>({
    userId: "",
    name: "",
    password: "",
    passwordConfirm: "",
    email: "",
    phone: "",
  });

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
        passwordConfirm: values.passwordConfirm,
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
