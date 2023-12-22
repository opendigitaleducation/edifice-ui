import { type ReactNode, type ReactElement } from "react";

import { Button } from "@edifice-ui/react";
import { IAction, RightRole } from "edifice-ts-client";
import { useTranslation } from "react-i18next";

import useActionBar from "~/features/Actionbar/hooks/useActionBar";
import useAccessControl, { IObjectWithRights } from "~/hooks/useAccessControl";
import { useIsTrash, useStoreActions } from "~/store";

// TODO move it to ode-react-ui with useAccessControl

interface AccessControlProps {
  roleExpected: RightRole | RightRole[];
  resourceRights: string | string[] | IObjectWithRights | IObjectWithRights[];
  action: IAction;
  children: ReactNode;
  renderWhenForbidden?: () => ReactElement;
}

export function AccessControl({
  resourceRights,
  roleExpected,
  action,
  children,
  renderWhenForbidden,
}: AccessControlProps): ReactElement {
  const { t } = useTranslation();
  const { overrideLabel } = useActionBar();
  const { visible } = useAccessControl({
    roles: roleExpected,
    rights: resourceRights,
    action: action?.id,
  });
  const { setResourceActionDisable } = useStoreActions();
  const isTrashFolder = useIsTrash();
  if (visible) {
    return <>{children}</>;
  } else if (renderWhenForbidden) {
    return renderWhenForbidden();
  } else if (isTrashFolder && !visible) {
    return (
      <Button
        type="button"
        color="primary"
        variant="filled"
        onClick={() => {
          setResourceActionDisable(true);
        }}
      >
        {t(overrideLabel(action))}
      </Button>
    );
  } else {
    return <></>;
  }
}
