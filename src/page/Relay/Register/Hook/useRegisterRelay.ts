import { type SubmitEventHandler, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRelay, joinRelay } from "../api/registerApi";
import { uploadImageToS3 } from "../../../../api/s3Api";

interface UseRegisterRelayParams {
  address: string;
  latitude: number | null;
  longitude: number | null;
  isStepAdd: boolean | null;
  relayId: number;
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

  const handleImageChange = (file: File | null) => {
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!isStepAdd && categoryId == null) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    const photoUrl = image ? await uploadImageToS3(image, "RELAY") : undefined;
    if (!isStepAdd && categoryId) {
      try {
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
        alert("릴레이가 등록되었습니다.");
        navigate("/relay/list");
      } catch (error) {
        alert(error instanceof Error ? error.message : "릴레이 등록에 실패했습니다.");
      }
    }

    if (isStepAdd) {
      try {
        await joinRelay(relayId, {
          locationName: address,
          address,
          latitude: latitude!,
          longitude: longitude!,
          photoUrl: photoUrl ?? "",
          content,
        });

        alert("릴레이에 참여했습니다.");
        navigate(`/relay/detail/${relayId}`);
      } catch (error) {
        alert(error instanceof Error ? error.message : "참여에 실패했습니다.");
      }
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
