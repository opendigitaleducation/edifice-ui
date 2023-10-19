import {
  ChangeEvent,
  ComponentPropsWithRef,
  forwardRef,
  Ref,
  useRef,
  useState,
} from "react";

import { Delete, Edit } from "@edifice-ui/icons";
import clsx from "clsx";
import { IWebApp } from "edifice-ts-client";

import useDropzone from "../../hooks/useDropzone/useDropzone";
import { AppIcon } from "../AppIcon";
import { Avatar } from "../Avatar";
import { IconButton } from "../Button";
import { FormControl } from "../Form";
import { Input } from "../Input";

export interface ImagePickerProps extends ComponentPropsWithRef<"input"> {
  /**
   * Description of the ImagePicker label.
   */
  label: string;
  /**
   * Accessible description of the add button
   */
  addButtonLabel: string;
  /**
   * Accessible description of the delete button
   */
  deleteButtonLabel: string;
  /**
   * Provide a default image as placeholder
   */
  src?: string;
  /**
   * To show the icon of an application
   */
  app?: IWebApp | undefined;

  appCode?: string;
  /**
   * Optional class for styling purpose
   */
  className?: string;
  /**
   * Callback when uploading image
   */
  onUploadImage: (obj: Record<string, string>) => void;
  /**
   * Callback when deleting image
   */
  onDeleteImage: () => void;
}

const ImagePicker = forwardRef(
  (
    {
      label,
      addButtonLabel = "Add image",
      deleteButtonLabel = "Delete image",
      src,
      className,
      app,
      onUploadImage,
      onDeleteImage,
    }: ImagePickerProps,
    ref: Ref<HTMLInputElement>,
  ) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [preview, setPreview] = useState<Record<string, string>>({
      name: "",
      image: src || "",
    });

    const handleChange = (files?: FileList | null) => {
      setPreview({ ...preview, name: "", image: "" });

      const file = files?.[0];
      if (!file) {
        return;
      }

      const newPreview = {
        ...preview,
        name: file.name,
        image: URL.createObjectURL(file),
      };

      setPreview(newPreview);
      onUploadImage(newPreview);
    };

    const handleClick = () => {
      inputRef.current?.click();
    };

    const handleClean = () => {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
      const cleanPreview = { ...preview, name: "", image: "" };
      setPreview(cleanPreview);
      onDeleteImage();
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      handleChange(event.target.files);
    };

    const classes = clsx("image-input", className);

    const { handleDragging, handleDragLeave, handleDrop } = useDropzone(
      inputRef,
      handleChange,
    );

    return (
      <FormControl
        id="image-input"
        className={classes}
        onDragEnter={handleDragging}
        onDragOver={handleDragging}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        ref={ref}
      >
        <div className="image-input-actions gap-8">
          <IconButton
            aria-label={addButtonLabel}
            color="tertiary"
            icon={<Edit />}
            onClick={handleClick}
            type="button"
            variant="ghost"
          />
          <IconButton
            aria-label={deleteButtonLabel}
            color="danger"
            disabled={!preview.image}
            icon={<Delete width="20" height="20" />}
            onClick={handleClean}
            type="button"
            variant="ghost"
          />
        </div>
        <FormControl.Label>
          <span className="visually-hidden">{label}</span>
          <Input
            accept="image/*"
            hidden
            onChange={handleInputChange}
            ref={inputRef}
            size="sm"
            type="file"
          />
          {preview.image ? (
            <Avatar alt={preview.name} src={preview.image} size="xl" />
          ) : (
            <AppIcon app={app} iconFit="ratio" size="160" variant="rounded" />
          )}
        </FormControl.Label>
      </FormControl>
    );
  },
);

ImagePicker.displayName = "ImagePicker";

export default ImagePicker;
