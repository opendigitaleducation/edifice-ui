import { forwardRef } from "react";

import { Files } from "@edifice-ui/icons";

import { useCardContext } from "./CardContext";

const FolderCard = forwardRef(() => {
  const { classesFiles, classesTitle, name } = useCardContext();

  return (
    <div className="card-body">
      <Files width="48" height="48" className={classesFiles} />
      <div>
        <h3 className={classesTitle}>
          <strong>{name}</strong>
        </h3>
      </div>
    </div>
  );
});

FolderCard.displayName = "FolderCard";

export default FolderCard;
