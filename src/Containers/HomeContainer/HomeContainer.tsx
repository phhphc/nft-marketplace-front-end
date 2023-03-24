import { collectionList } from "./mockCollectionListData";
import Link from "next/link";

export interface ICollection {
  imgSrc: string;
  name: string;
  floorPrice: number;
  volume: number;
}

export interface ICollectionList {
  collectionList: ICollection[];
}

function HomeContainer() {
  return (
    <>
      {/* Trend collection table */}
      <div className="flex-col w-full pt-10">
        <span className="font-bold text-xl border-b pb-2 mb-6 flex">
          Top Collections
        </span>
        <div className="trend-table flex flex-col">
          {/* Table header */}
          <div className="flex w-full">
            <div className="w-1/2 flex justify-between text-sm font-semibold text-gray-400 my-2 px-3">
              <span className="flex-1">Collection</span>
              <span className="w-20 text-center">Floor price</span>
              <span className="w-28 text-center">Volume</span>
            </div>
            <div className="w-1/2 flex justify-between text-sm font-semibold text-gray-400 my-2 px-3">
              <span className="flex-1">Collection</span>
              <span className="w-20 text-center">Floor price</span>
              <span className="w-28 text-center">Volume</span>
            </div>
          </div>

          {/* Table content */}
          <div className="flex flex-col flex-wrap h-80">
            {collectionList.map((collection, index) => (
              <Link
                href={"/collection/gemma"}
                className="flex px-3 h-24 items-center text-lg font-medium hover:bg-slate-100 rounded-lg"
              >
                <div className="flex flex-1 items-center space-x-6">
                  <span className="text-gray-400 font-bold text-xl">
                    {index + 1}
                  </span>
                  <img
                    src={collection.imgSrc}
                    alt="collection-img"
                    className="rounded-lg w-16 h-16"
                  />
                  <span className="">{collection.name}</span>
                </div>
                <span className="w-20 text-center">
                  {collection.floorPrice} ETH
                </span>
                <span className="w-28 text-center">
                  {collection.volume} ETH
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Notable */}
      <div className="flex-col mt-8">
        <span className="font-bold text-xl border-b pb-2 mb-6 flex">
          Notable Collection
        </span>
        <div className="mt-8 h-72 w-full overflow-x-scroll scroll-bar rounded-lg drop-shadow-lg">
          <div className="flex w-fit">
            {collectionList.map((collection) => (
              <Link
                href={"/collection/gemma"}
                className="scroll-bar-item w-56 h-64 mr-3 snap-start flex flex-col justify-between rounded-lg border hover:translate-y-1"
              >
                <img
                  src={collection.imgSrc}
                  alt="collection-img"
                  className="w-full h-3/5 rounded-t-lg"
                />
                <span className="px-3 font-semibold text-xl">
                  {collection.name}
                </span>
                <div className="flex px-3 text-sm  mb-3 rounded-b-lg">
                  <div className="w-1/2 flex flex-col">
                    <span className="text-gray-400">FLOOR</span>
                    <span className="font-bold">
                      {collection.floorPrice} ETH
                    </span>
                  </div>
                  <div className="w-1/2 flex flex-col">
                    <span className="text-gray-400">TOTAL VOLUME</span>
                    <span className="font-bold">{collection.volume} ETH</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* TOP buy */}
      <div className="flex-col mt-8">
        <span className="font-bold text-xl border-b pb-2 mb-6 flex">
          Top Collector Buys Today
        </span>
        <div className="mt-8 h-72 w-full overflow-x-scroll scroll-bar rounded-lg drop-shadow-lg">
          <div className="flex w-fit">
            {collectionList.map((collection) => (
              <Link
                href={"/collection/gemma"}
                className="scroll-bar-item w-56 h-64 mr-3 snap-start flex flex-col justify-between rounded-lg border hover:translate-y-1"
              >
                <img
                  src={collection.imgSrc}
                  alt="collection-img"
                  className="w-full h-3/5 rounded-t-lg"
                />
                <span className="px-3 font-semibold text-xl">
                  {collection.name}
                </span>
                <div className="flex px-3 text-sm  mb-3 rounded-b-lg">
                  <div className="w-1/2 flex flex-col">
                    <span className="text-gray-400">FLOOR</span>
                    <span className="font-bold">
                      {collection.floorPrice} ETH
                    </span>
                  </div>
                  <div className="w-1/2 flex flex-col">
                    <span className="text-gray-400">TOTAL VOLUME</span>
                    <span className="font-bold">{collection.volume} ETH</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default HomeContainer;
