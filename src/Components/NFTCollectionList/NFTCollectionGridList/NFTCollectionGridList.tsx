import NFTCollectionGridItem from "./NFTCollectionGridItem";
import { COLLECTION_VIEW_TYPE } from "@Constants/index";
import { INFTCollectionItem } from "@Interfaces/index";
import { NFT_COLLECTION_MODE } from "@Constants/index";

export interface INFTCollectionGridListProps {
  nftCollectionList: INFTCollectionItem[];
  viewType: COLLECTION_VIEW_TYPE;
  mode: NFT_COLLECTION_MODE;
  setCountFetchNftCollectionList: React.Dispatch<React.SetStateAction<number>>;
}

const NFTCollectionGridList = ({
  nftCollectionList,
  viewType,
  mode,
  setCountFetchNftCollectionList,
}: INFTCollectionGridListProps) => {
  return (
    <>
      {nftCollectionList?.length > 0 ? (
        <div
          className={`grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 xl:gap-x-8 col-span-4 nft-collection-grid-list ${
            viewType === COLLECTION_VIEW_TYPE.LARGE_GRID
              ? "lg:grid-cols-4"
              : "lg:grid-cols-3"
          }`}
        >
          {nftCollectionList.map((item) => (
            <NFTCollectionGridItem
              setCountFetchNftCollectionList={setCountFetchNftCollectionList}
              key={item.token_id}
              item={item}
              viewType={viewType}
              mode={mode}
            />
          ))}
        </div>
      ) : (
        <div className="text-center">There is no item to display</div>
      )}
    </>
  );
};

export default NFTCollectionGridList;
