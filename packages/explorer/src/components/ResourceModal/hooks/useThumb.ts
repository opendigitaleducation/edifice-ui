import { useState } from "react";

import { IResource } from "edifice-ts-client";

interface UseThumbProps {
  isUpdating: boolean;
  selectedResource?: IResource;
}

export const useThumb = ({ isUpdating, selectedResource }: UseThumbProps) => {
  const [thumbnail, setThumbnail] = useState<string | Blob | File>(
    isUpdating ? selectedResource?.thumbnail || "" : "",
  );
  const handleUploadImage = (file: File) => setThumbnail(file);
  const handleDeleteImage = () => setThumbnail("");

  return {
    thumbnail,
    handleDeleteImage,
    handleUploadImage,
  };
};
