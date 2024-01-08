import { RefAttributes, useEffect, useMemo, useState } from "react";

import { MergeCells, SplitCells } from "@edifice-ui/icons";
import { IconButtonProps, Toolbar } from "@edifice-ui/react";
import {
  FloatingMenu,
  FloatingMenuProps,
  Editor,
  findParentNodeClosestToPos,
} from "@tiptap/react";
import { useTranslation } from "react-i18next";

import { TableToolbarAddMenu } from "./TableToolbar.AddMenu";
import { TableToolbarCellColor } from "./TableToolbar.CellColor";
import { TableToolbarDelMenu } from "./TableToolbar.DelMenu";

interface TableToolbarProps {
  /**
   * editor instance
   */
  editor: Editor | null;
}

const TableToolbar = ({ editor }: TableToolbarProps) => {
  const { t } = useTranslation();

  // Display the Split action when truthy, and Merge action when falsy.
  const [isSpan, setSpan] = useState<boolean | undefined>(undefined);

  // Options need some computing
  const tippyOptions: FloatingMenuProps["tippyOptions"] = useMemo(() => {
    // Adjust a DOMRect to make it visible at a correct place.
    function adjustRect(rect: DOMRect) {
      let yOffset = 0;
      if (window.visualViewport) {
        const bottomScreen =
          window.innerHeight || document.documentElement.clientHeight;
        if (rect.bottom >= bottomScreen) {
          yOffset += rect.bottom - bottomScreen - rect.height;
        }
      }
      return new DOMRect(rect.x, rect.y - yOffset, rect.width, rect.height);
    }

    return {
      placement: "bottom",
      offset: [0, 0],
      zIndex: 999,
      // popperOptions: {modifiers: [ /*see popper v2 modifiers*/ ]},
      // Try to get the bounding rect of the table.
      getReferenceClientRect: () => {
        const parentDiv = editor?.isActive("table")
          ? findParentNodeClosestToPos(
              editor.state.selection.$anchor,
              (node) => node.type.name === "table",
            )
          : null;

        // Retrieve the <div class="tableWrapper"> that wraps the <table>
        if (parentDiv) {
          const parentDomNode = editor?.view.nodeDOM(parentDiv.pos) as
            | HTMLElement
            | undefined;

          const tableDomNode = parentDomNode?.querySelector("table");
          if (tableDomNode) {
            return adjustRect(tableDomNode.getBoundingClientRect());
          }
        }

        // This should never happen... but it keeps the transpiler happy.
        return new DOMRect(0, 0, 100, 100);
      },
    };
  }, [editor]);

  useEffect(() => {
    const cellAttr = editor?.getAttributes("tableCell");
    const headAttr = editor?.getAttributes("tableHeader");
    if (typeof cellAttr !== "undefined" || typeof headAttr !== "undefined") {
      const newSpan =
        cellAttr?.["colspan"] > 1 ||
        cellAttr?.["rowspan"] > 1 ||
        headAttr?.["colspan"] > 1 ||
        headAttr?.["rowspan"] > 1;
      newSpan !== isSpan && setSpan(newSpan);
    } else {
      isSpan && setSpan(undefined);
    }
  }, [editor, editor?.state, isSpan]);

  return (
    <>
      {editor && (
        <FloatingMenu
          editor={editor}
          tippyOptions={tippyOptions}
          shouldShow={() => editor.isActive("table")}
        >
          <Toolbar
            className="p-4"
            items={[
              {
                type: "dropdown",
                name: "bkg-col",
                // isEnable:
                //   typeof editor?.getAttributes("tableCell") !== "undefined",
                props: {
                  children: (
                    triggerProps: JSX.IntrinsicAttributes &
                      Omit<IconButtonProps, "ref"> &
                      RefAttributes<HTMLButtonElement>,
                    itemRefs,
                  ) => (
                    <TableToolbarCellColor
                      editor={editor}
                      itemRefs={itemRefs}
                    />
                  ),
                },
              },
              {
                type: "icon",
                name: "mergeorsplit",
                // isEnable: typeof isSpan !== "undefined",
                props: {
                  icon: isSpan ? <SplitCells /> : <MergeCells />,
                  "aria-label": isSpan ? t("Fractionner") : t("Fusionner"),
                  onClick: () => editor?.chain().focus().mergeOrSplit().run(),
                },
              },
              {
                type: "divider",
                name: "add-d0",
              },
              {
                type: "dropdown",
                name: "add",
                props: {
                  children: () => <TableToolbarAddMenu editor={editor} />,
                },
              },
              {
                type: "divider",
                name: "add-d1",
              },
              {
                type: "dropdown",
                name: "del",
                props: {
                  children: () => <TableToolbarDelMenu editor={editor} />,
                },
              },
            ]}
          />
        </FloatingMenu>
      )}
    </>
  );
};

export default TableToolbar;
