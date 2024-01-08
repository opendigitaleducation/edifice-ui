import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  HighlightColumn,
  HighlightRow,
} from "@edifice-ui/icons";
import { Dropdown } from "@edifice-ui/react";
import { Editor } from "@tiptap/react";
import { useTranslation } from "react-i18next";

interface Props {
  /**
   * editor instance
   */
  editor: Editor | null;
}

export const TableToolbarAddMenu = ({ editor }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Dropdown.Trigger variant="ghost" label={t("Ajouter")} />
      <Dropdown.Menu>
        <Dropdown.Item
          key="add-above"
          icon={<ArrowUp />}
          onClick={() => editor?.chain().focus().addRowBefore().run()}
        >
          {t("Ligne au dessus")}
        </Dropdown.Item>
        <Dropdown.Item
          key="add-below"
          icon={<ArrowDown />}
          onClick={() => editor?.chain().focus().addRowAfter().run()}
        >
          {t("Ligne en dessous")}
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item
          key="add-left"
          icon={<ArrowLeft />}
          onClick={() => editor?.chain().focus().addColumnBefore().run()}
        >
          {t("Colonne à gauche")}
        </Dropdown.Item>
        <Dropdown.Item
          key="add-right"
          icon={<ArrowRight />}
          onClick={() => editor?.chain().focus().addColumnAfter().run()}
        >
          {t("Colonne à droite")}
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item
          key="header-row"
          icon={<HighlightRow />}
          onClick={() => editor?.chain().focus().toggleHeaderRow().run()}
        >
          {t("Entête première ligne")}
        </Dropdown.Item>
        <Dropdown.Item
          key="header-col"
          icon={<HighlightColumn />}
          onClick={() => editor?.chain().focus().toggleHeaderColumn().run()}
        >
          {t("Entête première colonne")}
        </Dropdown.Item>
      </Dropdown.Menu>
    </>
  );
};
