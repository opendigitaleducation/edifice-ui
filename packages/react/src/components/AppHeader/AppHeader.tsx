import { forwardRef, ReactNode, Ref } from "react";

import clsx from "clsx";
export interface AppHeaderProps {
  /**
   * Accept Breadcrumb Component
   */
  children: ReactNode;
  /**
   * Actions
   */
  render?: () => JSX.Element | null;
  /**
   * When no layout is used
   */
  isFullscreen?: boolean;
}

const AppHeader = forwardRef(
  (
    { children, render, isFullscreen = false }: AppHeaderProps,
    ref: Ref<HTMLDivElement>,
  ) => {
    const classes = clsx("d-flex p-16 border-bottom bg-white", {
      "justify-content-between": render,
      "mx-n16": !isFullscreen,
      "z-3 top-0 start-0 end-0 position-fixed": isFullscreen,
    });

    return (
      <div ref={ref} className={classes}>
        {children}
        {render ? (
          <div className="d-flex align-items-center gap-8">{render()}</div>
        ) : null}
      </div>
    );
  },
);

AppHeader.displayName = "AppHeader";

export default AppHeader;
