import { MouseEventHandler } from "react";

import { AppIcon, Badge, useOdeIcons } from "@edifice-ui/react";
import { Editor, NodeViewWrapper } from "@tiptap/react";
import clsx from "clsx";

interface LinkerProps {
  selected: boolean;
  editor: Editor;
  [x: string]: any;
}

const LinkerRenderer = ({ selected, ...props }: LinkerProps) => {
  const { getIconCode } = useOdeIcons();
  const { editor } = props;
  const {
    class: className,
    title,
    "data-app-prefix": appPrefix,
    href,
    target,
  } = props.node.attrs;

  const classes = clsx(
    "align-middle badge-linker c-pointer",
    className,
    selected && "bg-secondary-200",
  );

  const appCode = getIconCode(appPrefix);

  const handleBadgeClick: MouseEventHandler<HTMLSpanElement> = (event) => {
    // Clicking a linker badge in read mode opens the link
    if (editor && !editor.isEditable) {
      event.preventDefault;
      window.open(href ?? "about:blank", target ?? "_blank");
    }
  };

  return (
    <NodeViewWrapper as={"span"}>
      <Badge
        variant={{ type: "link" }}
        className={classes}
        onClick={handleBadgeClick}
        data-drag-handle
      >
        <AppIcon size="24" app={appCode} />
        <span className="ms-8 text-truncate">{title}</span>
      </Badge>
    </NodeViewWrapper>
  );
};

export default LinkerRenderer;
