/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import clsx from "clsx";

export interface OptionListItemType {
  /**
   * Value
   */
  value: string | number;
  /**
   * Label
   */
  label: string;
  /**
   * Add an icon
   */
  icon?: any;
}

export interface SelectListProps {
  /**
   * Options list
   */
  options: OptionListItemType[];
  /**
   * State initializing select state
   */
  model?: Array<string | number>;
  /**
   * Synchronisation of model value
   */
  onChange?: (model: Array<string | number>) => void;
  /**
   * Option to hide checkbox
   */
  hideCheckbox?: boolean;
  /**
   * Option to manage a model with only one element at a time.
   */
  isMonoSelection?: boolean;
}

export type SelectListType = React.ReactElement<SelectListProps>;

const SelectList = ({
  options,
  hideCheckbox,
  isMonoSelection,
  onChange,
  model = [],
}: SelectListProps) => {
  const [localModel, setLocalModel] = useState(model);
  const handleOptionClick = (value: string | number) => {
    if (isMonoSelection) {
      setLocalModel([value]);
    } else {
      setLocalModel((previousModel) => {
        const newModel = [...previousModel];
        if (previousModel.includes(value)) {
          newModel.splice(newModel.indexOf(value), 1);
        } else {
          newModel.push(value);
        }
        return newModel;
      });
    }
  };

  useEffect(() => {
    onChange?.(localModel);
  }, [localModel]);

  return (
    <>
      <div className="select-list">
        {options?.map((option: OptionListItemType) => (
          <div
            key={option.value}
            className={clsx(
              "select-list-option",
              hideCheckbox &&
                localModel.includes(option.value) &&
                "text-secondary fw-bold",
            )}
            role="checkbox"
            aria-checked={localModel.includes(option.value)}
            onMouseUp={() => {
              handleOptionClick(option.value);
            }}
            tabIndex={0}
            onKeyDown={(event) => {
              event.key === "Enter" && handleOptionClick(option.value);
            }}
          >
            <div className="select-list-option-icon">
              {option.icon &&
                React.createElement(option.icon, {
                  width: "20px",
                  height: "20px",
                })}
            </div>
            <div className="select-list-option-label">{option.label}</div>
            {!hideCheckbox && (
              <div className="select-list-option-checkbox">
                <input
                  readOnly
                  type="checkbox"
                  tabIndex={-1}
                  checked={localModel.includes(option.value)}
                  className="form-check-input c-pointer"
                  id="option.value"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

SelectList.displayName = "SelectList";

export default SelectList;
