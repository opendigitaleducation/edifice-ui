import { useCallback, useEffect, useState } from "react";

import {
  ColorPalette,
  ColorPicker,
  ColorPickerItem,
  DefaultPalette,
  Dropdown,
} from "@edifice-ui/react";
import { Editor } from "@tiptap/react";
import { useTranslation } from "react-i18next";

interface Props {
  /**
   * editor instance
   */
  editor: Editor | null;
  /**
   * Tracks refs on ColorPickers.
   */
  itemRefs: any;
}

export const TableToolbarCellColor = ({ editor, itemRefs }: Props) => {
  const { t } = useTranslation();

  // Cell color, defaults to "transparent".
  const [color, setColor] = useState<string>("transparent");

  // Triggered when the user chooses a color for cells background.
  const applyColor = useCallback(
    (value: string) => {
      editor
        ?.chain()
        .focus()
        .setCellAttribute(
          "backgroundColor",
          // reset color is transparent here => remove bkg color
          value === "transparent" ? "" : value,
        )
        .run();
      setColor(value);
    },
    [editor, setColor],
  );

  // When cursor moves in table, update the current background color.
  useEffect(() => {
    setColor(
      editor?.getAttributes("tableCell").backgroundColor ?? "transparent",
    );
  }, [editor, editor?.state]);

  // Palettes of available colors to choose from.
  const palettes: ColorPalette[] = [
    {
      ...DefaultPalette,
      label: t("Couleur de cellule"),
      reset: {
        value: "transparent",
        description: t("Aucune"),
        isReset: true,
      },
    },
  ];

  return (
    <>
      <Dropdown.Trigger
        variant="ghost"
        aria-label={t("Couleur de fond")}
        icon={
          <ColorPickerItem
            model={{
              value: color,
              description: "",
              isReset: !color || color.length === 0 || color === "transparent",
            }}
          />
        }
      />
      <Dropdown.Menu>
        <ColorPicker
          ref={(el) => (itemRefs.current["color-picker"] = el)}
          model={color}
          palettes={palettes}
          onSuccess={(item) => applyColor(item.value)}
        />
      </Dropdown.Menu>
    </>
  );
};
