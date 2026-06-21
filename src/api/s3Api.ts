import axios from "axios";
import api from "./api";

export type S3UploadType = "PROFILE" | "RELAY";

interface PresignedUrlResponse {
  presignedUrl: string;
  imageUrl: string;
}

const getPresignedUrl = async (
  type: S3UploadType,
): Promise<PresignedUrlResponse> => {
  const response = await api.get<PresignedUrlResponse>("/s3/presigned-url", {
    params: { type },
  });
  return response.data;
};

export const uploadImageToS3 = async (
  file: File,
  type: S3UploadType,
): Promise<string> => {
  const { presignedUrl, imageUrl } = await getPresignedUrl(type);

  await axios.put(presignedUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
  });

  return imageUrl;
};
