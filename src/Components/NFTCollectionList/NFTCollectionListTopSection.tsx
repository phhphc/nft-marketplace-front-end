import React, { useState } from "react";
import { COLLECTION_VIEW_TYPE } from "@Constants/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTh,
  faTable,
  faImage,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "primereact/dropdown";
import { SORT_OPTIONS } from "@Constants/index";
import { IDropDown } from "@Interfaces/index";
import { InputText } from "primereact/inputtext";

export interface INFTCollectionListTopSection {
  currentSort: IDropDown;
  setCurrentSort: React.Dispatch<React.SetStateAction<IDropDown>>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  viewType: COLLECTION_VIEW_TYPE;
  handleChangeView: (selectedViewType: COLLECTION_VIEW_TYPE) => void;
}

const NFTCollectionListTopSection = ({
  currentSort,
  setCurrentSort,
  searchValue,
  setSearchValue,
  viewType,
  handleChangeView,
}: INFTCollectionListTopSection) => {
  const handleClickSortDropdown = (sort: IDropDown) => {
    setCurrentSort(sort);
  };

  const handleChangeSearchValue = (newSearchValue: string) => {
    setSearchValue(newSearchValue);
  };

  const iconList = [faList, faTh, faTable, faImage];
  const viewTypeList = [
    COLLECTION_VIEW_TYPE.LIST,
    COLLECTION_VIEW_TYPE.LARGE_GRID,
    COLLECTION_VIEW_TYPE.MEDIUM_GRID,
    COLLECTION_VIEW_TYPE.ICON_VIEW,
  ];
  return (
    <div className="flex justify-between flex-wrap">
      <InputText
        className="flex-1 mr-12 mb-8"
        value={searchValue}
        onChange={(e) => handleChangeSearchValue(e.target.value)}
        placeholder="Search name"
      />
      <Dropdown
        className="w-1/4 mr-12 mb-8"
        value={currentSort}
        options={SORT_OPTIONS}
        onChange={(e) => handleClickSortDropdown(e.value)}
        optionLabel="name"
        placeholder="Sort"
      />
      <div className="flex items-center mb-8">
        {iconList.map((icon, index) => (
          <i
            key={index}
            className={`px-4 py-2 border border-gray-600 cursor-pointer ${
              viewTypeList[index] === viewType ? "opacity-100" : "opacity-50"
            }`}
            onClick={() => handleChangeView(viewTypeList[index])}
          >
            <FontAwesomeIcon icon={icon} />
          </i>
        ))}
      </div>
    </div>
  );
};

export default NFTCollectionListTopSection;
