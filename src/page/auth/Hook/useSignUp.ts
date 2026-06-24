import { type SubmitEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../api/authApi";
import { uploadImageToS3 } from "../../../api/s3Api";
import { useForm } from "./useForm";
import { toast } from "../../../store/toastStore";

type SignUpForm = {
  loginId: string;
  password: string;
  passwordConfirm: string;
  name: string;
  email: string;
  phone: string;
};

type SignUpErrors = Partial<Record<keyof SignUpForm, string>>;

const EMPTY_MESSAGES: Record<keyof SignUpForm, string> = {
  loginId: "아이디를 입력해주세요.",
  name: "이름을 입력해주세요.",
  password: "비밀번호를 입력해주세요.",
  passwordConfirm: "비밀번호 확인을 입력해주세요.",
  email: "이메일을 입력해주세요.",
  phone: "전화번호를 입력해주세요.",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const useSignUp = () => {
  const navigate = useNavigate();
  const { values, handleChange } = useForm<SignUpForm>({
    loginId: "",
    name: "",
    password: "",
    passwordConfirm: "",
    email: "",
    phone: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<
    string | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<SignUpErrors>({});

  const passwordMismatch =
    Boolean(values.passwordConfirm) &&
    values.password !== values.passwordConfirm;

  const handleFieldChange = (key: keyof SignUpForm, value: string) => {
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
    handleChange(key, value);
  };

  const validate = () => {
    const next: SignUpErrors = {};
    (Object.keys(EMPTY_MESSAGES) as (keyof SignUpForm)[]).forEach((key) => {
      if (!values[key].trim()) next[key] = EMPTY_MESSAGES[key];
    });
    if (!next.email && !EMAIL_PATTERN.test(values.email.trim())) {
      next.email = "올바른 이메일 형식이 아닙니다.";
    }
    if (!next.passwordConfirm && values.password !== values.passwordConfirm) {
      next.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleProfileImageChange = (file: File | null) => {
    setProfileImage(file);
    setProfileImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      const profileImageUrl = profileImage
        ? await uploadImageToS3(profileImage, "PROFILE")
        : undefined;

      await signUp({
        loginId: values.loginId,
        name: values.name,
        password: values.password,
        passwordConfirm: values.passwordConfirm,
        email: values.email,
        phone: values.phone,
        profileImage: profileImageUrl,
      });

      toast.success("회원가입이 완료되었습니다.");
      navigate("/auth/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "회원가입에 실패했습니다.");
      setIsSubmitting(false);
    }
  };

  return {
    values,
    handleChange: handleFieldChange,
    passwordMismatch,
    profileImagePreview,
    handleProfileImageChange,
    handleSubmit,
    isSubmitting,
    errors,
  };
};
