import { useEffect, useId, useState } from "react";

import { useToast } from "@edifice-ui/react";
import { IResource } from "edifice-ts-client";
import { hash } from "ohash";
import { UseFormWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import slugify from "react-slugify";

import { FormInputs } from "../ResourceModal";

interface UseSlugProps {
  watch: UseFormWatch<FormInputs>;
  selectedResource?: IResource;
}

export const useSlug = ({ watch, selectedResource }: UseSlugProps) => {
  const [slug, setSlug] = useState<string>("");
  const [isPublic, setIsPublic] = useState<boolean>(
    !!selectedResource?.public || false,
  );

  const uniqueId = useId();
  const resourceName = watch("title");

  const { t } = useTranslation();
  const toast = useToast();

  const newSlug = `${hash({
    foo: `${resourceName}${uniqueId}`,
  })}-${slugify(resourceName)}`;

  useEffect(() => {
    if (isPublic) {
      let slug = "";

      if (selectedResource && selectedResource.slug) {
        slug = selectedResource.slug;
      } else {
        slug = newSlug;
      }

      setSlug(slug);
    }
  }, [isPublic, selectedResource, resourceName, uniqueId, newSlug]);

  function onPublicChange(value: boolean) {
    setIsPublic(value);
  }

  function onCopyToClipBoard() {
    navigator.clipboard.writeText(
      `${window.location.origin}${window.location.pathname}/pub/${slug}`,
    );
    toast.success(t("explorer.copy.clipboard"));
  }

  return {
    slug,
    uniqueId,
    isPublic,
    resourceName,
    onPublicChange,
    onCopyToClipBoard,
  };
};
