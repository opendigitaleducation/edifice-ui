import { ReactNode } from "react";

import { useTabsContext } from "./Tabs";
import { TabsItemProps } from "./TabsItem";

export interface TabsPanelProps {
  /**
   * Content of the item
   */
  children: ReactNode;
  /**
   * Current Item
   */
  currentItem: TabsItemProps | undefined;
}

const TabsPanel = ({ children, currentItem }: TabsPanelProps) => {
  const { activeTab } = useTabsContext();

  return (
    <div className="tab-content">
      <div
        className={`tab-pane fade ${
          activeTab === currentItem?.id ? "show active" : ""
        }`}
        id={`tabpanel-${currentItem?.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${currentItem?.id}`}
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
};

TabsPanel.displayName = "Tabs.Panel";

export default TabsPanel;