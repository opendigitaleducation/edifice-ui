import { useState, useRef, useEffect, useCallback } from "react";

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

export const useDropdown = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [menuItems, setMenuItems] = useState([]);

  const menuRef = useRef<HTMLUListElement | null>(null!);
  const triggerRef = useRef<HTMLButtonElement | null>(null!);

  useEffect(() => {
    // if (visible) if (menuRef.current) menuRef.current.focus();
    if (visible) if (menuRef.current) menuRef.current.firstChild.focus();
    console.log(menuRef.current && menuRef.current.firstChild);
    /* if (!visible) {
      if (triggerRef.current) {
        triggerRef.current.focus();
      }
    } */
  }, [visible]);

  useEffect(() => {
    if (menuRef.current) {
      const items = menuRef.current.querySelectorAll("[role]");
      const itemsArray = Array.from(items);
      setMenuItems(itemsArray);
    }
  }, []);

  const moveToPrevMenuItem = useCallback(
    (selectedItem: any) => {
      const index = menuItems?.findIndex(
        (item: { id: string }) => item.id === selectedItem.id,
      );
      if (selectedItem?.id === menuItems[0]?.id) {
        setSelectedItem(menuItems[menuItems.length - 1]);
      } else {
        setSelectedItem(menuItems[index - 1]);
      }
    },
    [menuItems],
  );

  const moveToNextMenuItem = useCallback(
    (selectedItem: any) => {
      const index = menuItems?.findIndex(
        (item: { id: string }) => item.id === selectedItem.id,
      );

      if (selectedItem?.id === menuItems[menuItems.length - 1]?.id) {
        setSelectedItem(menuItems[0]);
      } else {
        setSelectedItem(menuItems[index + 1]);
      }
    },
    [menuItems],
  );

  const moveToFirstMenuItem = useCallback(() => {
    setSelectedItem(menuItems[0]);
  }, [menuItems]);

  const moveToLastMenuItem = useCallback(() => {
    setSelectedItem(menuItems[menuItems.length - 1]);
  }, [menuItems]);

  const openDropdown = useCallback(() => {
    setVisible(true);
    moveToFirstMenuItem();
  }, [moveToFirstMenuItem]);

  const closeDropdown = useCallback(() => {
    setVisible(false);
  }, []);

  const stopEvents = (flag: boolean, event: React.KeyboardEvent<any>) => {
    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  };

  const onTriggerKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      console.log("onTriggerKeyDown");
      let flag = false;

      switch (event.code) {
        // case KEYS.Space:
        case " ":
        case KEYS.Enter:
        case KEYS.ArrowDown:
        case KEYS.Down:
          openDropdown();
          moveToFirstMenuItem();
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
          moveToLastMenuItem();
          flag = true;
          break;

        default:
          break;
      }

      stopEvents(flag, event);
    },
    [closeDropdown, moveToFirstMenuItem, moveToLastMenuItem, openDropdown],
  );

  /* const onMenuItemKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLLIElement>) => {
      console.log("onMenuItemKeyDown");
      event.preventDefault();
      switch (event.code) {
        case KEYS.Space:
        case KEYS.Enter:
          if (triggerRef.current) {
            triggerRef.current.focus();
          }
          break;

        case KEYS.ArrowDown:
        case KEYS.Down:
          if (!visible) setVisible(true);
          moveToNextMenuItem(selectedItem);
          break;

        case KEYS.ArrowUp:
        case KEYS.Up:
          if (!visible) setVisible(true);
          moveToPrevMenuItem(selectedItem);
          break;

        case KEYS.Home:
          setSelectedItem(menuItems[0]);
          break;

        case KEYS.End:
          setSelectedItem(menuItems[menuItems.length - 1]);
          break;

        default:
          break;
      }
    },
    [menuItems, moveToNextMenuItem, moveToPrevMenuItem, selectedItem, visible],
  ); */

  const onMenuKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLUListElement>) => {
      console.log("onMenuKeyDown");
      let flag = false;

      if (event.ctrlKey || event.altKey || event.metaKey) {
        return;
      }

      if (event.shiftKey) {
        if (event.key === KEYS.Tab) {
          closeDropdown();
          flag = true;
        }
      } else {
        switch (event.code) {
          case " ":
          case KEYS.Enter:
          case KEYS.Space:
            console.log(selectedItem.role !== "menuitemcheckbox");
            console.log(selectedItem.role);
            if (selectedItem.role === "menuitem") {
              console.log("in");
              closeDropdown();
              flag = true;
            }
            break;

          case KEYS.Esc:
          case KEYS.Escape:
            closeDropdown();
            flag = true;
            break;

          case KEYS.Up:
          case KEYS.ArrowUp:
            moveToPrevMenuItem(selectedItem);
            flag = true;
            break;

          case KEYS.ArrowDown:
          case KEYS.Down:
            moveToNextMenuItem(selectedItem);
            flag = true;
            break;

          case KEYS.Home:
          case KEYS.PageUp:
            moveToFirstMenuItem();
            flag = true;
            break;

          case KEYS.End:
          case KEYS.PageDown:
            moveToLastMenuItem();
            flag = true;
            break;

          case KEYS.Tab:
            closeDropdown();
            break;

          default:
            break;
        }
      }

      stopEvents(flag, event);
    },
    [
      closeDropdown,
      moveToFirstMenuItem,
      moveToLastMenuItem,
      moveToNextMenuItem,
      moveToPrevMenuItem,
      selectedItem,
    ],
  );

  const onTriggerClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (visible === true) {
        setVisible(false);
      } else {
        setVisible(true);
        setSelectedItem(menuItems[0]);
      }
      event.stopPropagation();
      event.preventDefault();
    },
    [menuItems, visible],
  );

  const onMenuItemClick = useCallback(
    (item: unknown) => {
      // setSelectedItem(item);
      console.log("onMenuItemClick");
      closeDropdown();
    },
    [closeDropdown],
  );

  return {
    selectedItem,
    visible,
    triggerRef,
    menuRef,
    setVisible,
    onTriggerKeyDown,
    onTriggerClick,
    onMenuKeyDown,
    onMenuItemKeyDown,
    onMenuItemClick,
  };
};
