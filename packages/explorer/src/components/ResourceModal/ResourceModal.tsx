import { useId } from "react";

import {
  useOdeClient,
  useToast,
  Modal,
  Heading,
  ImagePicker,
  FormControl,
  Label,
  Input,
  TextArea,
  isActionAvailable,
  Button,
} from "@edifice-ui/react";
import { UseMutationResult } from "@tanstack/react-query";
import {
  APP,
  CreateParameters,
  CreateResult,
  IAction,
  IFolder,
  IResource,
  UpdateParameters,
  UpdateResult,
} from "edifice-ts-client";
import { hash } from "ohash";
import { createPortal } from "react-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import slugify from "react-slugify";

import { useSlug } from "./hooks/useSlug";
import { useThumb } from "./hooks/useThumb";
import { PublicResource } from "./PublicResource";
/* import {
  Modal,
  Heading,
  ImagePicker,
  FormControl,
  Label,
  Input,
  TextArea,
  Button,
} from "..";
import { useOdeClient } from "../../core";
import { useToast } from "../../hooks";
import { isActionAvailable } from "../../utils"; */

export interface FormInputs {
  title: string;
  description: string;
  enablePublic: boolean;
}

interface BaseProps {
  isOpen: boolean;
  actions: IAction[] | undefined;
  onSuccess: () => void;
  onCancel: () => void;
}

interface CreateProps extends BaseProps {
  mode: "create";
  createResource: UseMutationResult<
    CreateResult,
    unknown,
    CreateParameters,
    unknown
  >;
  currentFolder: Partial<IFolder>;
}

interface UpdateProps extends BaseProps {
  mode: "update";
  updateResource: UseMutationResult<
    UpdateResult,
    unknown,
    UpdateParameters,
    unknown
  >;
  selectedResource: IResource;
}

type Props = CreateProps | UpdateProps;

const ResourceModal = ({
  isOpen,
  actions,
  onCancel,
  onSuccess,
  ...props
}: Props) => {
  const { appCode: app, currentApp } = useOdeClient();
  const { t } = useTranslation();
  const { mode } = props;

  const formId = useId();

  const isCreating = mode === "create";
  const isUpdating = mode === "update";

  const {
    watch,
    register,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = useForm<FormInputs>({
    mode: "onChange",
    defaultValues: {
      description: isUpdating ? props.selectedResource?.description : "",
      enablePublic: isUpdating ? props.selectedResource?.public : false,
      title: isUpdating ? props.selectedResource?.name : "",
    },
  });

  const {
    slug,
    uniqueId,
    isPublic,
    resourceName,
    onPublicChange,
    onCopyToClipBoard,
  } = useSlug({
    watch,
    selectedResource: isUpdating ? props.selectedResource : undefined,
  });

  const toast = useToast();

  const { thumbnail, handleDeleteImage, handleUploadImage } = useThumb({
    isUpdating,
  });

  const onSubmit: SubmitHandler<FormInputs> = async function (
    formData: FormInputs,
  ) {
    try {
      const data = {
        description: formData.description || "",
        name: formData.title,
        public: formData.enablePublic,
        thumbnail,
      };

      const newSlug = `${hash({
        foo: `${formData.title}${uniqueId}`,
      })}-${slugify(formData.title)}`;

      if (isCreating) {
        await props.createResource.mutateAsync({
          ...data,
          folder:
            props.currentFolder?.id === "default"
              ? undefined
              : parseInt(props.currentFolder?.id || ""),
          slug: formData.enablePublic ? newSlug : "",
          app,
        });
      } else {
        await props.updateResource.mutateAsync({
          ...data,
          slug: formData.enablePublic
            ? props.selectedResource && props.selectedResource.slug
              ? props.selectedResource.slug
              : newSlug
            : "",
          entId: props.selectedResource.assetId,
          trashed: props.selectedResource.trashed,
        });
      }

      toast.success(
        <>
          <strong>
            {t(
              isCreating
                ? "explorer.resource.created"
                : "explorer.resource.updated",
            )}
          </strong>
          <p>
            {t("title")} : {formData.title}
          </p>
          <p>
            {t("description")} : {formData.description}
          </p>
          {app === APP.BLOG && (
            <p>
              Public:
              {formData.enablePublic
                ? t("explorer.enable.public.yes")
                : t("explorer.enable.public.no")}
            </p>
          )}
        </>,
      );
      onSuccess();
    } catch (e) {
      console.error(e);
    }
  };

  return createPortal(
    <Modal
      id={`${mode}-resource`}
      size="lg"
      isOpen={isOpen}
      onModalClose={onCancel}
    >
      <Modal.Header onModalClose={onCancel}>
        {t(
          `explorer.resource.editModal.header.${
            isCreating ? "create" : "edit"
          }`,
        )}
      </Modal.Header>

      <Modal.Body>
        <Heading headingStyle="h4" level="h3" className="mb-16">
          {t("explorer.resource.editModal.heading.general")}
        </Heading>

        <form id={formId} onSubmit={handleSubmit(onSubmit)}>
          <div className="d-block d-md-flex gap-16 mb-24">
            <div>
              <ImagePicker
                app={currentApp}
                src={isUpdating ? props.selectedResource?.thumbnail || "" : ""}
                label={t("explorer.imagepicker.label")}
                addButtonLabel={t("explorer.imagepicker.button.add")}
                deleteButtonLabel={t("explorer.imagepicker.button.delete")}
                onUploadImage={handleUploadImage}
                onDeleteImage={handleDeleteImage}
                className="align-self-center mt-8"
              />
            </div>

            <div className="col">
              <FormControl id="title" className="mb-16" isRequired>
                <Label>{t("title")}</Label>
                <Input
                  type="text"
                  defaultValue={isUpdating ? props.selectedResource?.name : ""}
                  {...register("title", {
                    required: true,
                    pattern: {
                      value: /[^ ]/,
                      message: "invalid title",
                    },
                  })}
                  placeholder={t(
                    "explorer.resource.editModal.title.placeholder",
                  )}
                  size="md"
                  aria-required={true}
                />
              </FormControl>
              <FormControl id="description" isOptional>
                <Label>{t("description")}</Label>
                <TextArea
                  defaultValue={
                    isUpdating ? props.selectedResource?.description : ""
                  }
                  {...register("description")}
                  placeholder={t(
                    "explorer.resource.editModal.description.placeholder",
                  )}
                  size="md"
                />
              </FormControl>
            </div>
          </div>

          {app === APP.BLOG &&
            isActionAvailable({ workflow: "createPublic", actions }) && (
              <PublicResource
                appCode={app}
                isPublic={isPublic}
                slug={slug}
                onCopyToClipBoard={onCopyToClipBoard}
                onPublicChange={onPublicChange}
                register={register}
                resourceName={resourceName}
              />
            )}
        </form>
      </Modal.Body>

      <Modal.Footer>
        <Button
          color="tertiary"
          onClick={onCancel}
          type="button"
          variant="ghost"
        >
          {t("explorer.cancel")}
        </Button>
        <Button
          form={formId}
          type="submit"
          color="primary"
          isLoading={isSubmitting}
          variant="filled"
          disabled={!isValid || isSubmitting}
        >
          {t(isCreating ? "explorer.create" : "save")}
        </Button>
      </Modal.Footer>
    </Modal>,
    document.getElementById("portal") as HTMLElement,
  );
};

export default ResourceModal;
