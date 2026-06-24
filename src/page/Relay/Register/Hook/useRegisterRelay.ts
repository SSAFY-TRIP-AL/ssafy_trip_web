import { type SubmitEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRelay, joinRelay } from "../api/registerApi";
import { uploadImageToS3 } from "../../../../api/s3Api";
import { toast } from "../../../../store/toastStore";

interface UseRegisterRelayParams {
  address: string;
  latitude: number | null;
  longitude: number | null;
  isStepAdd: boolean | null;
  relayId: number;
}

export interface RegisterErrors {
  title?: string;
  category?: string;
  image?: string;
  address?: string;
  content?: string;
}

export const useRegisterRelay = ({
  address,
  latitude,
  longitude,
  isStepAdd,
  relayId,
}: UseRegisterRelayParams) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<RegisterErrors>({});

  const clearError = (field: keyof RegisterErrors) => {
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleImageChange = (file: File | null) => {
    if (file) clearError("image");
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const validate = () => {
    const next: RegisterErrors = {};
    if (!isStepAdd) {
      if (!title.trim()) next.title = "릴레이 제목을 입력해주세요.";
      if (categoryId == null) next.category = "카테고리를 선택해주세요.";
    }
    if (!image) next.image = "사진을 등록해주세요.";
    if (!address.trim()) next.address = "위치를 입력해주세요.";
    if (!content.trim()) next.content = "릴레이 설명을 입력해주세요.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const photoUrl = image ? await uploadImageToS3(image, "RELAY") : undefined;

      if (!isStepAdd && categoryId) {
        await createRelay({
          title,
          categoryId,
          address,
          locationName: address,
          latitude,
          longitude,
          photoUrl: photoUrl,
          content,
        });
        toast.success("릴레이가 등록되었습니다.");
        navigate("/relay/list");
        return;
      }

      if (isStepAdd) {
        await joinRelay(relayId, {
          locationName: address,
          address,
          latitude: latitude!,
          longitude: longitude!,
          photoUrl: photoUrl ?? "",
          content,
        });

        toast.success("릴레이에 참여했습니다.");
        navigate(`/relay/detail/${relayId}`);
        return;
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : isStepAdd
            ? "참여에 실패했습니다."
            : "릴레이 등록에 실패했습니다.",
      );
      setIsSubmitting(false);
    }
  };

  return {
    title,
    setTitle,
    categoryId,
    setCategoryId,
    content,
    setContent,
    imagePreview,
    handleImageChange,
    handleSubmit,
    isSubmitting,
    errors,
    clearError,
  };
};
