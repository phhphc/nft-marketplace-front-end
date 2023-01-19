import { useState } from "react";
import { COLLECTION_VIEW_TYPE } from "@Constants/index";
import NFTCollectionGridList from "@Components/NFTCollectionList/NFTCollectionGridList/NFTCollectionGridList";
import { nftCollectionList } from "@Components/NFTCollectionList/mockData";
import NFTCollectionListTopSection from "@Components/NFTCollectionList/NFTCollectionListTopSection";
import NFTCollectionFilter from "@Components/NFTCollectionList/NFTCollectionFilter";

const NFTCollectionList = () => {
  const [viewType, setViewType] = useState<COLLECTION_VIEW_TYPE>(
    COLLECTION_VIEW_TYPE.LARGE_GRID
  );

  const handleChangeView = (selectedViewType: COLLECTION_VIEW_TYPE) => {
    if (selectedViewType === viewType) return;
    setViewType(selectedViewType);
  };

  return (
    <div id="nft-collection-list">
      <NFTCollectionListTopSection
        viewType={viewType}
        handleChangeView={handleChangeView}
      />
      <div className="grid mt-6 grid-cols-5 gap-4">
        <NFTCollectionFilter />
        <NFTCollectionGridList
          viewType={viewType}
          nftCollectionList={nftCollectionList}
        />
      </div>
    </div>
  );
};

export default NFTCollectionList;
