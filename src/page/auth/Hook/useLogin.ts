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

type LoginErrors = Partial<Record<keyof LoginForm, string>>;

export default function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { values, handleChange } = useForm<LoginForm>({
    loginId: "",
    password: "",
  });
  const { login: storeLogin } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<LoginErrors>({});

  const handleFieldChange = (key: keyof LoginForm, value: string) => {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
    handleChange(key, value);
  };

  const validate = () => {
    const next: LoginErrors = {};
    if (!values.loginId.trim()) next.loginId = "아이디를 입력해주세요.";
    if (!values.password.trim()) next.password = "비밀번호를 입력해주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;
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
    handleChange: handleFieldChange,
    handleSubmit,
    isSubmitting,
    errors,
  };
}
