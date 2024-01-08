import { useEffect, useMemo, useState } from "react";

import { Edit, ExternalLink, Unlink } from "@edifice-ui/icons";
import { Toolbar, ToolbarItem } from "@edifice-ui/react";
import { FloatingMenu, Editor } from "@tiptap/react";
import { useTranslation } from "react-i18next";

import { tippyOptions } from "./LinkToolbar.TippyOptions";

interface LinkToolbarProps {
  /**
   * editor instance
   */
  editor: Editor | null;
  /** Handle Edit event */
  onEdit: (attrs: any) => void;
  /** Handle Open event */
  onOpen: (attrs: any) => void;
  /** Handle Unlink event */
  onUnlink: (attrs: any) => void;
}

const LinkToolbar = ({
  editor,
  onEdit,
  onOpen,
  onUnlink,
}: LinkToolbarProps) => {
  const { t } = useTranslation();

  // Current Linker node (or Hyperlink mark) attributes
  const [linkAttrs, setLinkAttrs] = useState<Record<string, any> | undefined>();

  const LinkToolbarItems: ToolbarItem[] = useMemo(() => {
    return [
      {
        type: "icon",
        name: "edit",
        props: {
          icon: <Edit />,
          "aria-label": t("Modifier"),
          onClick: () => onEdit?.(linkAttrs),
        },
      },
      {
        type: "icon",
        name: "open",
        props: {
          icon: <ExternalLink />,
          "aria-label": t("Ouvrir dans un nouvel onglet"),
          onClick: () => onOpen?.(linkAttrs),
        },
      },
      {
        type: "icon",
        name: "unlink",
        props: {
          icon: <Unlink className="text-danger" />,
          "aria-label": t("Ouvrir dans un nouvel onglet"),
          onClick: () => onUnlink?.(linkAttrs),
        },
      },
    ];
  }, [onEdit, onOpen, onUnlink, t, linkAttrs]);

  // Retrieve any selected linker node ONLY WHEN EDITOR STATE CHANGES
  useEffect(() => {
    if (editor?.isActive("linker"))
      setLinkAttrs(editor.getAttributes("linker"));
    else if (editor?.isActive("hyperlink"))
      setLinkAttrs(editor.getAttributes("hyperlink"));
    else setLinkAttrs(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor?.state]);

  const handleShouldShow = () =>
    (editor?.isEditable &&
      (editor?.isActive("linker") || editor?.isActive("hyperlink"))) ||
    false;

  return (
    <>
      {editor && (
        <FloatingMenu
          editor={editor}
          tippyOptions={tippyOptions}
          shouldShow={handleShouldShow}
        >
          <Toolbar className="p-4" items={LinkToolbarItems} />
        </FloatingMenu>
      )}
    </>
  );
};

export default LinkToolbar;
