import { useState } from "react";
import { COLLECTION_VIEW_TYPE } from "@Constants/index";
import NFTCollectionGridList from "@Components/NFTCollectionList/NFTCollectionGridList/NFTCollectionGridList";
import { nftCollectionList } from "@Components/NFTCollectionList/mockData";
import NFTCollectionListTopSection from "@Components/NFTCollectionList/NFTCollectionListTopSection";
import NFTCollectionFilter from "@Components/NFTCollectionList/NFTCollectionFilter";
import NFTCollectionTableList from "@Components/NFTCollectionList/NFTCollectionTableList/NFTCollectionTableList";

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
      <div className="grid mt-6 grid-cols-4 gap-4">
        <NFTCollectionFilter />
        <div className="col-start-2 col-end-12">
          {viewType === COLLECTION_VIEW_TYPE.LIST ? (
            <NFTCollectionTableList
              viewType={viewType}
              nftCollectionList={nftCollectionList}
            />
          ) : (
            <NFTCollectionGridList
              viewType={viewType}
              nftCollectionList={nftCollectionList}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTCollectionList;
