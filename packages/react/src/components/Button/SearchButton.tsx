/**
 * Button  Component
 *
 * @see Docs     https://edifice-ui.vercel.app/?path=/docs/components-core-button--base
 * @see Source   https://github.com/opendigitaleducation/edifice-ui/blob/main/packages/core/src/Button/Button.tsx
 * @see WAI-ARIA https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */
import { forwardRef, Ref } from "react";

import { Search } from "@edifice-ui/icons";
import clsx from "clsx";

import { ButtonRef } from "./Button";
import IconButton, { IconButtonProps } from "./IconButton";

type PickedProps = "type" | "icon" | "size";

export interface SearchButtonProps extends Pick<IconButtonProps, PickedProps> {
  onClick?: any;
  disabled?: boolean;
}

/**
 * SearchButton extends the IconButton component by omitting unnecessary props.
 */
const SearchButton = forwardRef(
  (
    { icon = <Search />, onClick, ...restProps }: SearchButtonProps,
    ref?: Ref<ButtonRef>,
  ) => {
    const classes = clsx("btn-search");

    return (
      <IconButton
        ref={ref}
        className={classes}
        icon={icon}
        {...restProps}
        onClick={onClick}
      />
    );
  },
);

SearchButton.displayName = "SearchButton";

export default SearchButton;
