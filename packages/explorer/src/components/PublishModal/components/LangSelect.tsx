import { Select } from "@edifice-ui/react";
import { Control, Controller } from "react-hook-form";

import { useLanguageOptions } from "../hooks/useLanguageOptions";
import { FormDataProps } from "../hooks/usePublishModal";

const defaultSelectLanguageOption = "bpr.form.publication.language";

export const LangSelect = ({
  control,
}: {
  control: Control<FormDataProps, any>;
}) => {
  const languageOptions = useLanguageOptions();

  return (
    <div className="col">
      <Controller
        name="language"
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange } }) => {
          return (
            <Select
              block
              size="md"
              onValueChange={onChange}
              options={languageOptions}
              aria-required={true}
              placeholderOption={defaultSelectLanguageOption}
            />
          );
        }}
      />
    </div>
  );
};
