import { forwardRef, Key, ReactNode } from "react";

import clsx from "clsx";

/* `List` is a generic component that uses React.forwardRef
 * We must redeclare the typing of forwardRef to do this nicely.
 * @see an explanation at https://fettblog.eu/typescript-react-generic-forward-refs/
 */
// Local redeclaration of forwardRef
declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactNode | null,
  ): (props: P & React.RefAttributes<T>) => React.ReactNode | null;
}

/**
 * Properties of the List component
 */
export interface ListProps<T> {
  /** Items to display */
  items: Array<T>;
  /** Field in T to use as a React key, typically "id" */
  keyField: keyof T;

  /** Multi-selection allowed ? */
  multiselection?: boolean;
  /** Default renderer, if both are available. */
  mode?: "card" | "row";

  /** Empty screen displayed when no items are available. */
  children?: ReactNode;

  /** Optional class for styling purpose */
  className?: string;

  /** Items sélectionnés */
  onChange?: (selection: Array<T>) => void;

  //--- Pour le rendu par Card :
  cardRenderer?: (item: any, index: number) => JSX.Element;

  //--- Pour le rendu par Row :
  rowRenderer?: (item: any, index: number) => JSX.Element;
}

/**
 * List component to display items in a flex grid (Card mode) or a list (Row mode)
 */
function InnerList<T>(
  { mode, ...props }: ListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  // If undefined, defaults to card mode
  mode = mode ?? "card";
  let renderer = props.cardRenderer;

  // Check if row mode is available and activated
  if (mode === "row" && typeof props.rowRenderer === "function")
    renderer = props.rowRenderer;

  // Check that at least one renderer is activated.
  if (!renderer)
    throw "List components must declare at least one cardRenderer or rowRenderer.";

  const className = clsx("list", mode, props.className);

  return (
    <div className={className} ref={ref}>
      {props.items.map((item, index) => {
        return (
          <div
            key={item[props.keyField] as Key}
            className={clsx(mode, index & 1 ? "even" : "odd")}
          >
            {renderer?.(item, index)}
          </div>
        );
      })}
    </div>
  );
}

InnerList.displayName = "List";

export default forwardRef(InnerList);
