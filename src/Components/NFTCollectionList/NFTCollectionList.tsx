import { useState } from "react";
import { COLLECTION_VIEW_TYPE } from "@Constants/index";
import NFTCollectionGridList from "@Components/NFTCollectionList/NFTCollectionGridList/NFTCollectionGridList";
import { nftCollectionList } from "@Components/NFTCollectionList/mockData";
import NFTCollectionListTopSection from "@Components/NFTCollectionList/NFTCollectionListTopSection";

const NFTCollectionList = () => {
  const [viewType, setViewType] = useState<COLLECTION_VIEW_TYPE>(
    COLLECTION_VIEW_TYPE.LARGE_GRID
  );

  const handleChangeView = (selectedViewType: COLLECTION_VIEW_TYPE) => {
    if (selectedViewType === viewType) return;
    setViewType(selectedViewType);
  };

  return (
    <>
      <NFTCollectionListTopSection
        viewType={viewType}
        handleChangeView={handleChangeView}
      />
      <NFTCollectionGridList
        viewType={viewType}
        nftCollectionList={nftCollectionList}
      />
    </>
  );
};

export default NFTCollectionList;
