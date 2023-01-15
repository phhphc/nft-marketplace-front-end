import React from "react";
import { COLLECTION_VIEW_TYPE } from "@Constants/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTh,
  faTable,
  faImage,
  faList,
} from "@fortawesome/free-solid-svg-icons";

export interface INFTCollectionListTopSection {
  viewType: COLLECTION_VIEW_TYPE;
  handleChangeView: (selectedViewType: COLLECTION_VIEW_TYPE) => void;
}

const NFTCollectionListTopSection = ({
  viewType,
  handleChangeView,
}: INFTCollectionListTopSection) => {
  const iconList = [faList, faTh, faTable, faImage];
  const viewTypeList = [
    COLLECTION_VIEW_TYPE.LIST,
    COLLECTION_VIEW_TYPE.LARGE_GRID,
    COLLECTION_VIEW_TYPE.MEDIUM_GRID,
    COLLECTION_VIEW_TYPE.ICON_VIEW,
  ];
  return (
    <div className="flex">
      <div className="ml-auto">
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
