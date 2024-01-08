import {
  Delete,
  DeleteColumn,
  DeleteColumnHighlight,
  DeleteRow,
  DeleteRowHighlight,
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

export const TableToolbarDelMenu = ({ editor }: Props) => {
  const { t } = useTranslation();

  return (
    <>
      <Dropdown.Trigger variant="ghost" label={t("Supprimer")} />
      <Dropdown.Menu>
        <Dropdown.Item
          key="del-row"
          icon={<DeleteRow />}
          onClick={() => editor?.chain().focus().deleteRow().run()}
        >
          {t("Supprimer la ligne")}
        </Dropdown.Item>
        <Dropdown.Item
          key="del-col"
          icon={<DeleteColumn />}
          onClick={() => editor?.chain().focus().deleteColumn().run()}
        >
          {t("Supprimer la colonne")}
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item
          key="del-header-row"
          icon={<DeleteRowHighlight />}
          onClick={() => editor?.chain().focus().toggleHeaderRow().run()}
        >
          {t("Supprimer en-tête ligne")}
        </Dropdown.Item>
        <Dropdown.Item
          key="del-header-col"
          icon={<DeleteColumnHighlight />}
          onClick={() => editor?.chain().focus().toggleHeaderColumn().run()}
        >
          {t("Supprimer en-tête colonne")}
        </Dropdown.Item>
        <Dropdown.Separator />
        <Dropdown.Item
          key="del-table"
          icon={<Delete />}
          onClick={() => editor?.chain().focus().deleteTable().run()}
        >
          {t("Supprimer tableau")}
        </Dropdown.Item>
      </Dropdown.Menu>
    </>
  );
};
