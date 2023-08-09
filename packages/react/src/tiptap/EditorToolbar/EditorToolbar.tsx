import { forwardRef, Ref } from "react";

import Toolbar, {
  ToolbarOptions,
  ToolbarOptionsType,
  ToolbarProps,
  ToolbarRef,
} from "../../components/Toolbar/Toolbar";

/**
 * EditorToolbar extends Toolbar.
 */

export type EditorToolbarOptions = {
  type?: ToolbarOptionsType;
  icon: JSX.Element;
  label: string;
  name: string;
  action: () => void;
  isActive?: boolean;
  isEnabled?: boolean;
  className?: string;
} & ToolbarOptions;

const EditorToolbar = forwardRef(
  ({ data, ...restProps }: ToolbarProps, ref?: Ref<ToolbarRef>) => {
    return <Toolbar ref={ref} {...restProps} data={data} variant="no-shadow" />;
  },
);

EditorToolbar.displayName = "EditorToolbar";

export default EditorToolbar;
