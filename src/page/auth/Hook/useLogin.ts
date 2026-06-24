import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "./useForm";
import { type SubmitEventHandler, useState } from "react";
import { login } from "../api/authApi";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "../../../store/toastStore";

type LoginForm = {
  loginId: string;
  password: string;
};

export default function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { values, handleChange } = useForm<LoginForm>({
    loginId: "",
    password: "",
  });
  const { login: storeLogin } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const data = await login({
        loginId: values.loginId,
        password: values.password,
      });

      toast.success(data.message ?? "로그인되었습니다.");
      storeLogin(data.accessToken, data.name, data.profileImage);
      const from = (location.state as { from?: { pathname?: string } } | null)?.from
        ?.pathname;
      navigate(from ?? "/", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "로그인에 실패했습니다.");
      setIsSubmitting(false);
    }
  };

  return {
    values,
    handleChange,
    handleSubmit,
    isSubmitting,
  };
}
