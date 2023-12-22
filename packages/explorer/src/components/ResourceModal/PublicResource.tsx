import { Copy } from "@edifice-ui/icons";
import { Alert, Button, FormControl, Heading } from "@edifice-ui/react";
import { UseFormRegister } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { FormInputs } from "./ResourceModal";

interface BlogPublicProps {
  appCode: string;
  isPublic: boolean;
  onCopyToClipBoard: () => void;
  onPublicChange: (boolean: boolean) => void;
  register: UseFormRegister<FormInputs>;
  slug: string;
  resourceName: string;
}

export const PublicResource = ({
  appCode,
  isPublic,
  onCopyToClipBoard,
  onPublicChange,
  register,
  slug,
  resourceName,
}: BlogPublicProps) => {
  const { t } = useTranslation();
  return (
    <>
      <Heading headingStyle="h4" level="h3" className="mb-16">
        {t("explorer.resource.editModal.heading.access")}
        {appCode}
      </Heading>

      <Alert type="info">{t("explorer.resource.editModal.access.alert")}</Alert>

      <FormControl
        id="flexSwitchCheckDefault"
        className="form-switch d-flex gap-8 mt-16 mb-8"
      >
        <FormControl.Input
          type="checkbox"
          role="switch"
          {...register("enablePublic", {
            disabled: !isPublic && !resourceName,
            onChange: (e: { target: { checked: any } }) => {
              onPublicChange(e.target.checked);
            },
          })}
          className="form-check-input mt-0"
          size="md"
        />
        <FormControl.Label className="form-check-label mb-0">
          {t("explorer.resource.editModal.access.flexSwitchCheckDefault.label")}
        </FormControl.Label>
      </FormControl>

      {isPublic && (
        <div className="d-flex flex-wrap align-items-center gap-4">
          <p className="text-break">
            {window.location.origin}
            {window.location.pathname}/pub/{slug}
          </p>
          <Button
            color="primary"
            disabled={!isPublic}
            onClick={onCopyToClipBoard}
            type="button"
            leftIcon={<Copy />}
            variant="ghost"
            className="text-nowrap"
          >
            {t("explorer.resource.editModal.access.url.button")}
          </Button>
        </div>
      )}
    </>
  );
};
