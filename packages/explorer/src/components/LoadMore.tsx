import { forwardRef, type Ref } from "react";

import { Button } from "@edifice-ui/react";
import { useTranslation } from "react-i18next";

const LoadMore = forwardRef((_props, ref: Ref<HTMLButtonElement>) => {
  const { t } = useTranslation();
  return (
    <div className="d-grid gap-2 col-4 mx-auto">
      <Button
        ref={ref}
        type="button"
        color="secondary"
        variant="filled"
        // style={{ visibility: "hidden" }}
      >
        {t("explorer.see.more")}
      </Button>
    </div>
  );
});

if (import.meta.env.MODE === "dev") LoadMore.displayName = "LoadMore";

export default LoadMore;
