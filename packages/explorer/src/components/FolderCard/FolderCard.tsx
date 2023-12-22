import { Files } from "@edifice-ui/icons";
import { CardProps, Card } from "@edifice-ui/react";
import { IWebApp } from "edifice-ts-client";

export interface FolderCardProps extends Omit<CardProps, "children"> {
  /**
   * IWeb App
   */
  app?: IWebApp | undefined;
  /**
   * Folder's name
   */
  name: string;
}

const FolderCard = ({
  app,
  name,
  isSelected = false,
  isSelectable = true,
  onClick,
  onSelect,
}: FolderCardProps) => {
  return (
    <Card
      app={app}
      isSelectable={isSelectable}
      isSelected={isSelected}
      onClick={onClick}
      onSelect={onSelect}
    >
      {(appCode) => (
        <Card.Body>
          <Files width="48" height="48" className={`color-app-${appCode}`} />
          <Card.Title>{name}</Card.Title>
        </Card.Body>
      )}
    </Card>
  );
};

FolderCard.displayName = "FolderCard";

export default FolderCard;
