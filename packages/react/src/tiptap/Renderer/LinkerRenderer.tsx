import { NodeViewWrapper } from "@tiptap/react";
import clsx from "clsx";

import { AppIcon, Badge } from "../../components";
import { useOdeIcons } from "../../core";

interface LinkerProps {
  selected: boolean;
  [x: string]: any;
}

const LinkerRenderer = ({ selected, ...props }: LinkerProps) => {
  const { getIconCode } = useOdeIcons();
  const {
    class: className,
    title,
    "data-app-prefix": appPrefix,
  } = props.node.attrs;

  const classes = clsx(
    "align-middle badge-linker",
    className,
    selected && "bg-secondary-200",
  );

  const appCode = getIconCode(appPrefix);

  return (
    <NodeViewWrapper as={"span"}>
      <Badge variant={{ type: "link" }} className={classes} data-drag-handle>
        <AppIcon size="24" app={appCode} />
        <span className="ms-8 text-truncate">{title}</span>
      </Badge>
    </NodeViewWrapper>
  );
};

export default LinkerRenderer;
