import { type SubmitEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signUp } from "../api/authApi";
import { uploadImageToS3 } from "../../../api/s3Api";
import { useForm } from "./useForm";

type SignUpForm = {
  loginId: string;
  password: string;
  passwordConfirm: string;
  name: string;
  email: string;
  phone: string;
};

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

  const passwordMismatch =
    Boolean(values.passwordConfirm) &&
    values.password !== values.passwordConfirm;

  const handleProfileImageChange = (file: File | null) => {
    setProfileImage(file);
    setProfileImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
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

      alert("회원가입이 완료되었습니다.");
      navigate("/auth/login");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "회원가입에 실패했습니다.",
      );
      setIsSubmitting(false);
    }
  };

  return {
    values,
    handleChange,
    passwordMismatch,
    profileImagePreview,
    handleProfileImageChange,
    handleSubmit,
    isSubmitting,
  };
};
