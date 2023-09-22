import { forwardRef } from "react";

import { Files } from "@edifice-ui/icons";
import clsx from "clsx";

import { useCardContext } from "./CardContext";

const Folder = forwardRef(() => {
  const {
    options: { name },
    isLoading,
    appCode,
    classesTitle,
  } = useCardContext();

  return (
    <div className="card-body">
      <Files
        width="48"
        height="48"
        className={clsx(`color-app-${appCode}`, {
          placeholder: isLoading,
        })}
      />
      <div>
        <h3 className={classesTitle}>
          <strong>{name}</strong>
        </h3>
      </div>
    </div>
  );
});

Folder.displayName = "Card.Folder";

export default Folder;
