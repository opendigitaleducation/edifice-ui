import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  MutableRefObject,
  RefCallback,
  Dispatch,
  SetStateAction,
} from "react";

import {
  Placement,
  autoUpdate,
  flip,
  offset,
  size,
  useFloating,
} from "@floating-ui/react";

export enum KEYS {
  Enter = "Enter",
  Space = "Space",
  ArrowDown = "ArrowDown",
  ArrowUp = "ArrowUp",
  Down = "Down",
  Up = "Up",
  Tab = "Tab",
  Esc = "Esc",
  Escape = "Escape",
  Home = "Home",
  End = "End",
  PageUp = "PageUp",
  PageDown = "PageDown",
}

type MutableRefList<T> = Array<
  RefCallback<T> | MutableRefObject<T> | undefined | null
>;

export interface UseDropdownProps {
  isFocused: string | null;
  visible: boolean;
  itemRefs: MutableRefObject<{ [key: string]: HTMLElement | null }>;
  triggerRef: MutableRefObject<HTMLButtonElement | null>;
  menuRef: MutableRefObject<HTMLUListElement | null>;
  triggerProps: Record<string, any>;
  menuProps: Record<string, any>;
  itemProps: Record<string, any>;
  setVisible: Dispatch<SetStateAction<boolean>>;
}

const useDropdown = (placement: Placement | undefined): UseDropdownProps => {
  /* Unique Dropdown Id */
  const id = useId();

  /* states */
  const [visible, setVisible] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isFocused, setIsFocused] = useState<string | null>(null);

  const { refs, floatingStyles } = useFloating({
    placement,
    open: visible,
    onOpenChange: setVisible,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(4),
      flip({ padding: 0 }),
      size({
        apply({ rects, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
          });
        },
      }),
    ],
  });

  /* refs */
  const menuRef = useRef<HTMLUListElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const itemRefs = useRef({});

  useEffect(() => {
    if (visible) {
      if (menuRef.current) {
        menuRef.current.focus();
        setActiveIndex(0);
      }
    } else {
      setActiveIndex(-1);
      itemRefs.current = {};
    }
  }, [visible]);

  useEffect(() => {
    if (activeIndex !== -1) {
      const currentItem = Object.values(itemRefs.current)[
        activeIndex
      ] as HTMLElement;
      const id = currentItem.getAttribute("id") as string;
      setIsFocused(id);
      currentItem.focus();
    }
  }, [activeIndex]);

  const nextItem = () => {
    const items = Object.values(itemRefs.current);
    const itemCount = items.length;
    setActiveIndex((prevIndex) => (prevIndex + 1) % itemCount);
  };

  const previousItem = () => {
    const items = Object.values(itemRefs.current);
    const itemCount = items.length;
    setActiveIndex((prevIndex) => (prevIndex - 1 + itemCount) % itemCount);
  };

  const firstItem = () => {
    setActiveIndex(0);
  };

  const lastItem = () => {
    const items = Object.values(itemRefs.current);
    const itemCount = items.length;
    setActiveIndex(itemCount - 1);
  };

  const openDropdown = useCallback(() => {
    setVisible(true);
  }, []);

  const closeDropdown = useCallback(() => {
    if (triggerRef.current) {
      triggerRef.current.focus();
      setVisible(false);
    }
  }, []);

  const stopEvents = (flag: boolean, event: React.KeyboardEvent) => {
    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  };

  const onTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      let flag = false;

      switch (event.code) {
        case " ":
        case KEYS.Space:
        case KEYS.Enter:
        case KEYS.ArrowDown:
        case KEYS.Down:
          openDropdown();
          flag = true;
          break;
        case KEYS.Esc:
        case KEYS.Escape:
          closeDropdown();
          flag = true;
          break;
        case KEYS.Up:
        case KEYS.ArrowUp:
          openDropdown();
          flag = true;
          break;
        default:
          break;
      }

      stopEvents(flag, event);
    },
    [closeDropdown, openDropdown],
  );

  const onMenuItemMouseEnter = (event: React.MouseEvent) => {
    const items: HTMLElement[] = Object.values(itemRefs.current);

    const index = items.findIndex(
      (item) => item.id === event.currentTarget.getAttribute("id"),
    );

    setActiveIndex(index);
  };

  const onMenuItemKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>, onSuccess?: () => void) => {
      let flag = false;

      if (event.shiftKey) {
        if (event.key === "Tab") {
          closeDropdown();
          flag = true;
        }
      } else {
        switch (event.code) {
          case KEYS.Escape:
            closeDropdown();
            break;
          case " ":
          case KEYS.Space:
          case KEYS.Enter:
            if (activeIndex !== -1) {
              const currentItem = Object.values(itemRefs.current)[
                activeIndex
              ] as HTMLElement;
              const role = currentItem.getAttribute("role");

              if (role === "menuitem") {
                if (triggerRef.current) {
                  triggerRef.current.focus();
                  setVisible(false);
                }
              }

              onSuccess?.();
            }
            flag = true;
            break;
          case KEYS.ArrowDown:
          case KEYS.Down:
            nextItem();
            flag = true;
            break;
          case KEYS.ArrowUp:
          case KEYS.Up:
            previousItem();
            flag = true;
            break;
          case KEYS.Home:
            firstItem();
            flag = true;
            break;
          case KEYS.End:
            lastItem();
            flag = true;
            break;
          default:
            break;
        }
        stopEvents(flag, event);
      }
    },
    [activeIndex, closeDropdown],
  );

  const onTriggerClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (visible === true) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      event.stopPropagation();
      event.preventDefault();
    },
    [visible],
  );

  const onMenuItemClick = useCallback(() => {
    closeDropdown();
  }, [closeDropdown]);

  function setRef<T>(val: T, ...refs: MutableRefList<T>): void {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(val);
      } else if (ref != null) {
        ref.current = val;
      }
    });
  }

  function mergeRefs<T>(...refs: MutableRefList<T>): RefCallback<T> {
    return (val: T) => {
      setRef(val, ...refs);
    };
  }

  return {
    isFocused,
    visible,
    itemRefs,
    triggerRef,
    menuRef,
    /* TriggerProps to spread to any Trigger component */
    triggerProps: {
      ref: mergeRefs(triggerRef, refs.setReference),
      id: `dropdown-toggle-${id}`,
      "aria-haspopup": "menu",
      "aria-controls": `dropdown-${id}`,
      "aria-expanded": visible ? true : false,
      className: `dropdown-toggle ${visible ? "selected" : ""}`,
      onClick: onTriggerClick,
      onKeyDown: onTriggerKeyDown,
      "aria-activedescendant": isFocused,
    },
    /* MenuProps to spread to any Menu Component */
    menuProps: {
      ref: mergeRefs(menuRef, refs.setFloating),
      className: "dropdown-menu bg-white shadow rounded-4 p-8",
      "aria-labelledby": `dropdown-toggle-${id}`,
      style: { ...floatingStyles },
    },
    /* ItemProps to spread to any item Component */
    itemProps: {
      onMenuItemMouseEnter,
      onMenuItemClick,
      onMenuItemKeyDown,
    },
    setVisible,
  };
};

export default useDropdown;
