import { type SubmitEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRelay } from "../api/registerApi";

interface UseRegisterRelayParams {
  address: string;
  latitude: number | null;
  longitude: number | null;
}

export const useRegisterRelay = ({
  address,
  latitude,
  longitude,
}: UseRegisterRelayParams) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [content, setContent] = useState("");
  // const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (file: File | null) => {
    // setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (categoryId == null) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    try {
      await createRelay({
        title,
        categoryId,
        address,
        latitude,
        longitude,
        content,
        // photoUrl: image,
      });

      alert("릴레이가 등록되었습니다.");
      navigate("/relaylist");
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "릴레이 등록에 실패했습니다.",
      );
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
  };
};
