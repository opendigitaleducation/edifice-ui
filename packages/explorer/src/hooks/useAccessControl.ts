import { useEffect, useState } from "react";

import { useUser } from "@edifice-ui/react";
import { type RightRole, odeServices, IResource } from "edifice-ts-client";

import { useIsTrash } from "~/store";

// TODO move it to ode-react-ui with AccessControl

export interface IObjectWithRights {
  rights: string[];
}

interface AccessControlProps {
  roles: RightRole | RightRole[];
  rights: string | string[] | IObjectWithRights | IObjectWithRights[];
  action: string | undefined;
}

export default function useAccessControl({
  roles,
  rights,
  action,
}: AccessControlProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const { user } = useUser();
  const isTrashFolder = useIsTrash();
  // run effect if params changes
  useEffect(() => {
    refreshState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roles, rights]);

  const checkRights = async function (rights: string[] | string) {
    const safeRight = rights instanceof Array ? rights : [rights];
    if (roles instanceof Array) {
      // roles is of type RightRole[]
      const can = await odeServices
        .rights()
        .sessionHasAtLeastOneResourceRight(roles, safeRight);
      setVisible(can);
    } else {
      // roles is of type RightRole
      const can = await odeServices
        .rights()
        .sessionHasResourceRight(roles, safeRight);
      setVisible(can);
    }
  };

  const checkRightForMultipleResources = async function (rights: string[][]) {
    if (roles instanceof Array) {
      const can = await odeServices
        .rights()
        .sessionHasAtLeastOneResourceRightForEachList(roles, rights);
      setVisible(can);
    } else {
      const can = await odeServices
        .rights()
        .sessionHasResourceRightForEachList(roles, rights);
      setVisible(can);
    }
  };

  // compute visibility according to rights
  const refreshState = async function () {
    if (roles === undefined) {
      setVisible(true);
      return;
    }

    if (
      isTrashFolder &&
      (rights as IResource[])[0]?.trashedBy?.includes(user?.userId as string) &&
      action === "restore" &&
      !(rights as IResource[])[0]?.trashed
    ) {
      setVisible(true);
      return;
    }

    if (rights instanceof Array) {
      // rights are of type Array
      if (rights.length > 0) {
        if (typeof rights[0] === "string") {
          // rights are of type string[]
          await checkRights(rights as string[]);
        } else {
          // rights are of type IResource[]
          const rightsArray = (rights as IObjectWithRights[]).map(
            (e) => e.rights,
          );
          await checkRightForMultipleResources(rightsArray);
        }
      } else {
        // array of rights is empty
        setVisible(false);
      }
    } else {
      // rights are not of type Array
      if (typeof rights === "string") {
        await checkRights(rights);
      } else {
        // rights are of type IResource
        await checkRights(rights.rights);
      }
    }
  };
  return {
    visible,
    refreshState,
  };
}
