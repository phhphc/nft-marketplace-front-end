import NFTCollectionGridItem from "./NFTCollectionGridItem";
import { COLLECTION_VIEW_TYPE } from "@Constants/index";

export interface INFTCollectionItem {
  id: string;
  imageSrc: string;
  name: string;
  price: number;
}

export interface INFTCollectionGridListProps {
  nftCollectionList: INFTCollectionItem[];
  viewType: COLLECTION_VIEW_TYPE;
}

const NFTCollectionGridList = ({
  nftCollectionList,
  viewType,
}: INFTCollectionGridListProps) => {
  return (
    <div
      className={`grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2  xl:gap-x-8 col-span-4 nft-collection-grid-list ${
        viewType === COLLECTION_VIEW_TYPE.LARGE_GRID
          ? "lg:grid-cols-4"
          : "lg:grid-cols-3"
      }`}
    >
      {nftCollectionList.map((item) => (
        <NFTCollectionGridItem key={item.id} item={item} viewType={viewType} />
      ))}
    </div>
  );
};

export default NFTCollectionGridList;
