import { Fragment } from "react";

import { Filter } from "@edifice-ui/icons";
import {
  FormControl,
  Input,
  SearchButton,
  Dropdown,
  useOdeClient,
} from "@edifice-ui/react";
import { useTranslation } from "react-i18next";

import { useSearchForm } from "../../hooks/useSearchForm";
import { useSelectedFilters } from "../../hooks/useSelectedFilters";

export const SearchForm = () => {
  const { appCode } = useOdeClient();
  const { t } = useTranslation();

  const { selectedFilters, options, handleOnSelectFilter } =
    useSelectedFilters();

  const {
    formRef,
    inputSearch,
    handleInputSearchChange,
    handleKeyPress,
    handleSearchSubmit,
  } = useSearchForm();

  const count = selectedFilters.length > 0 ? selectedFilters.length : undefined;

  return (
    <form
      noValidate
      className="bg-light p-16 ps-24 ms-n16 ms-lg-n24 me-n16 position-relative z-3 d-flex gap-8"
      ref={formRef}
    >
      <FormControl id="search" className="input-group">
        <Input
          type="search"
          placeholder={t("explorer.label.search", { ns: appCode })}
          size="lg"
          noValidationIcon
          value={inputSearch}
          onChange={handleInputSearchChange}
          onKeyDown={handleKeyPress}
        />
        <SearchButton
          type="submit"
          aria-label={t("explorer.label.search", { ns: appCode })}
          onClick={handleSearchSubmit}
        />
      </FormControl>
      <Dropdown placement="bottom-end">
        <Dropdown.Trigger
          label={t("explorer.filters")}
          icon={<Filter width={20} />}
          variant="ghost"
          badgeContent={count}
        />
        <Dropdown.Menu>
          {options.map((option) => {
            if (option.value === "0") {
              return (
                <Fragment key="0">
                  <Dropdown.RadioItem
                    value={option.value}
                    model={selectedFilters}
                    onChange={() => handleOnSelectFilter(option.value)}
                  >
                    {option.label}
                  </Dropdown.RadioItem>
                  <Dropdown.Separator />
                </Fragment>
              );
            }

            return (
              <Dropdown.RadioItem
                key={option.value}
                value={option.value}
                model={selectedFilters}
                onChange={() => handleOnSelectFilter(option.value)}
              >
                {option.label}
              </Dropdown.RadioItem>
            );
          })}
        </Dropdown.Menu>
      </Dropdown>
    </form>
  );
};
