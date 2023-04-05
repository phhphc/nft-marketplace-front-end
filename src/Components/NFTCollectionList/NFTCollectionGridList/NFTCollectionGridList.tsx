import NFTCollectionGridItem from "./NFTCollectionGridItem";
import { COLLECTION_VIEW_TYPE } from "@Constants/index";
import { INFTCollectionItem } from "@Interfaces/index";
import { NFT_COLLECTION_MODE } from "@Constants/index";
import { Paginator } from "primereact/paginator";
import { useEffect, useState } from "react";

export interface INFTCollectionGridListProps {
  nftCollectionList: INFTCollectionItem[][];
  viewType: COLLECTION_VIEW_TYPE;
  mode: NFT_COLLECTION_MODE;
}

const NFTCollectionGridList = ({
  nftCollectionList,
  viewType,
  mode,
}: INFTCollectionGridListProps) => {
  // console.log(
  //   "🚀 ~ file: NFTCollectionGridList.tsx:17 ~ nftCollectionList:",
  //   nftCollectionList
  // );

  var size = 12;
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);
  const [items, setItems] = useState<INFTCollectionItem[][]>([]);

  const onPageChange = (event: any) => {
    setItems(
      nftCollectionList.slice(event.page * size, event.page * size + size)
    );
    setFirst(event.first);
    setRows(event.rows);
  };

  useEffect(() => {
    setItems(nftCollectionList.slice(0, size));
  }, [nftCollectionList]);

  return (
    <>
      {nftCollectionList?.length > 0 ? (
        <div>
          <div
            className={`grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 xl:gap-x-8 col-span-4 nft-collection-grid-list ${
              viewType === COLLECTION_VIEW_TYPE.LARGE_GRID
                ? "lg:grid-cols-4"
                : "lg:grid-cols-3"
            }`}
          >
            {items.map((item) => (
              <NFTCollectionGridItem
                key={item[0].identifier}
                item={item}
                viewType={viewType}
                mode={mode}
              />
            ))}
          </div>
          <div className="card pt-12">
            <Paginator
              first={first}
              rows={rows}
              totalRecords={nftCollectionList.length}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      ) : (
        <div className="text-center">There is no item to display</div>
      )}
    </>
  );
};

export default NFTCollectionGridList;
