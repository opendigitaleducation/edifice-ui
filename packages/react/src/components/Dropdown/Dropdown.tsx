import React, { ReactElement, useEffect, useState } from "react";

import { animated, useTransition } from "@react-spring/web";
import clsx from "clsx";
import { usePopper } from "react-popper";

import { DropdownTriggerProps } from "./DropdownTrigger";

export interface DropdownProps {
  /**
   * Menu to display in dropdown
   */
  content: React.ReactNode;
  /**
   * Element to be wrapped as Tooltip trigger
   */
  trigger: ReactElement<DropdownTriggerProps>;
}

const Dropdown = ({ trigger, content }: DropdownProps) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null,
  );
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
    modifiers: [{ name: "offset", options: { offset: [0, 12] } }],
  });

  const [visible, setVisible] = useState<boolean>(false);

  const transition = useTransition(visible, {
    from: { opacity: 0, y: 10 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 10 },
  });

  const handleClick = () => {
    setVisible((oldState) => !oldState);
  };

  const clonedTrigger = React.cloneElement(trigger, {
    ref: setReferenceElement,
    onClick: handleClick,
    state: visible ? "selected" : "default",
  });

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        popperElement &&
        !popperElement.contains(event.target as Node) &&
        referenceElement &&
        !referenceElement.contains(event.target as Node)
      ) {
        setVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true);
    document.addEventListener("touchstart", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
      document.removeEventListener("touchstart", handleClickOutside, true);
    };
  }, [popperElement, referenceElement]);

  return (
    <>
      {clonedTrigger}

      {transition((style, visible) => (
        <>
          {visible && (
            <animated.div
              className={clsx(
                "bg-white shadow rounded-4 d-block show py-12 px-8",
                `bs-tooltip-auto`,
              )}
              ref={setPopperElement}
              style={{ ...styles.popper, ...style }}
              {...attributes.popper}
            >
              {content}
            </animated.div>
          )}
        </>
      ))}
    </>
  );
};

Dropdown.displayName = "Dropdown";

export default Dropdown;
