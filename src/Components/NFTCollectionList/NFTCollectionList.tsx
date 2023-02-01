import { useState } from "react";
import { COLLECTION_VIEW_TYPE } from "@Constants/index";
import NFTCollectionGridList from "@Components/NFTCollectionList/NFTCollectionGridList/NFTCollectionGridList";
import NFTCollectionListTopSection from "@Components/NFTCollectionList/NFTCollectionListTopSection";
import NFTCollectionFilter from "@Components/NFTCollectionList/NFTCollectionFilter";
import NFTCollectionTableList from "@Components/NFTCollectionList/NFTCollectionTableList/NFTCollectionTableList";
import { INFTCollectionItem } from "@Interfaces/index";

export interface INFTCollectionListProps {
  nftCollectionList: INFTCollectionItem[];
}

const NFTCollectionList = ({ nftCollectionList }: INFTCollectionListProps) => {
  const [viewType, setViewType] = useState<COLLECTION_VIEW_TYPE>(
    COLLECTION_VIEW_TYPE.LARGE_GRID
  );

  const handleChangeView = (selectedViewType: COLLECTION_VIEW_TYPE) => {
    if (selectedViewType === viewType) return;
    setViewType(selectedViewType);
  };

  return (
    <div id="nft-collection-list" className="mt-12">
      <NFTCollectionListTopSection
        viewType={viewType}
        handleChangeView={handleChangeView}
      />
      <div className="grid mt-6 grid-cols-5 gap-4">
        <NFTCollectionFilter />
        <div className="md:col-start-2 col-end-6 col-start-1">
          {viewType === COLLECTION_VIEW_TYPE.LIST ? (
            <NFTCollectionTableList nftCollectionList={nftCollectionList} />
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
