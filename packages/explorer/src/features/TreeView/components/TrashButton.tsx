/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Delete } from "@edifice-ui/icons";
import { useTranslation } from "react-i18next";

export interface TrashButtonProps {
  id: string;
  selected: boolean;
  onSelect: () => void;
}

export const TrashButton = ({
  id,
  selected,
  onSelect,
}: TrashButtonProps): JSX.Element | null => {
  const { t } = useTranslation();

  return (
    <div className="treeview">
      <ul role="tree" className="m-0 p-0">
        <li id={id} role="treeitem" aria-selected={selected}>
          <div>
            <div className="action-container">
              <div onClick={onSelect} role="button" tabIndex={0}>
                <div className="d-flex align-items-center gap-8 py-8 ps-24">
                  <Delete width="20" height="20" />
                  <span>{t("explorer.tree.trash")}</span>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default TrashButton;
