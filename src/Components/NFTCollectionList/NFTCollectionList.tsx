import { useEffect, useState } from "react";
import {
  COLLECTION_VIEW_TYPE,
  SORT_OPTIONS,
  SORT_OPTIONS_CODE,
} from "@Constants/index";
import NFTCollectionGridList from "@Components/NFTCollectionList/NFTCollectionGridList/NFTCollectionGridList";
import NFTCollectionListTopSection from "@Components/NFTCollectionList/NFTCollectionListTopSection";
import NFTCollectionFilter from "@Components/NFTCollectionList/NFTCollectionFilter";
import NFTCollectionTableList from "@Components/NFTCollectionList/NFTCollectionTableList/NFTCollectionTableList";
import { IDropDown, INFTCollectionItem } from "@Interfaces/index";
import { NFT_COLLECTION_MODE } from "@Constants/index";

export interface INFTCollectionListProps {
  nftCollectionList: INFTCollectionItem[][];
  mode: NFT_COLLECTION_MODE;
  refetch: () => void;
  hideSellBundle?: boolean;
}

const NFTCollectionList = ({
  nftCollectionList,
  mode,
  refetch,
  hideSellBundle = false,
}: INFTCollectionListProps) => {
  const [currentSort, setCurrentSort] = useState<IDropDown>(SORT_OPTIONS[0]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [nftCollectionListSearch, setNftCollectionListSearch] =
    useState<INFTCollectionItem[][]>(nftCollectionList);

  const [viewType, setViewType] = useState<COLLECTION_VIEW_TYPE>(
    COLLECTION_VIEW_TYPE.LARGE_GRID
  );

  const handleChangeView = (selectedViewType: COLLECTION_VIEW_TYPE) => {
    if (selectedViewType === viewType) return;
    setViewType(selectedViewType);
  };

  useEffect(() => {
    let sortFunction = (
      item1: INFTCollectionItem[],
      item2: INFTCollectionItem[]
    ) =>
      item2.reduce(
        (acc: number, cur: INFTCollectionItem) =>
          acc + Number(cur.listings?.[0]?.start_price || 0),
        0
      ) -
      item1.reduce(
        (acc: number, cur: INFTCollectionItem) =>
          acc + Number(cur.listings?.[0]?.start_price || 0),
        0
      );

    if (currentSort.code === SORT_OPTIONS_CODE.PRICE_LOW_TO_HIGH) {
      sortFunction = (
        item1: INFTCollectionItem[],
        item2: INFTCollectionItem[]
      ) =>
        item1.reduce(
          (acc: number, cur: INFTCollectionItem) =>
            acc + Number(cur.listings?.[0]?.start_price || 0),
          0
        ) -
        item2.reduce(
          (acc: number, cur: INFTCollectionItem) =>
            acc + Number(cur.listings?.[0]?.start_price || 0),
          0
        );
    }

    setNftCollectionListSearch(
      nftCollectionList
        .filter((item: INFTCollectionItem[]) =>
          item.some((nft: INFTCollectionItem) =>
            nft.name?.toLowerCase().includes(searchValue?.toLowerCase().trim())
          )
        )
        .sort(sortFunction)
    );
  }, [searchValue, nftCollectionList, currentSort.code]);

  return (
    <div id="nft-collection-list" className="mt-12">
      <NFTCollectionListTopSection
        currentSort={currentSort}
        setCurrentSort={setCurrentSort}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        viewType={viewType}
        handleChangeView={handleChangeView}
      />
      <div className="grid grid-cols-5 mt-6 gap-4">
        {/* <NFTCollectionFilter /> */}
        <div className="md:col-start-1 col-end-6 col-start-1">
          {viewType === COLLECTION_VIEW_TYPE.LIST ? (
            <NFTCollectionTableList
              refetch={refetch}
              nftCollectionList={nftCollectionListSearch}
              hideSellBundle={hideSellBundle}
            />
          ) : (
            <NFTCollectionGridList
              refetch={refetch}
              viewType={viewType}
              nftCollectionList={nftCollectionListSearch}
              mode={mode}
              hideSellBundle={hideSellBundle}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTCollectionList;
