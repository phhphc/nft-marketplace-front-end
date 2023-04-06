import "primeicons/primeicons.css";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";
import { ICollectionItem, INFTCollectionItem } from "@Interfaces/index";
import { useMemo } from "react";

export interface ICollectionInfoProps {
  collectionInfo: ICollectionItem[];
}

const NFTInfor = ({ collectionInfo }: ICollectionInfoProps) => {
  const [isSeeMore, setIsSeeMore] = useState(false);
  const handleClickToRead = () => {
    setIsSeeMore(!isSeeMore);
  };

  // const totalVolume = useMemo(() => {
  //   return Math.round(
  //     (nftCollectionList
  //       ? nftCollectionList.reduce(
  //           (acc, cur) => acc + Number(cur[0].listings[0]?.start_price || 0),
  //           0
  //         )
  //       : 0) / 1000000000000000000
  //   );
  // }, [nftCollectionList]);

  // const floorPrice = useMemo(() => {
  //   return Math.round(
  //     (nftCollectionList
  //       ? Math.min(
  //           ...(nftCollectionList
  //             .filter((item) => !!item[0].listings)
  //             .map((item) => Number(item[0].listings[0]?.start_price)) as any)
  //         )
  //       : 0) / 1000000000000000000
  //   );
  // }, [nftCollectionList]);

  return (
    <div id="nft-infor">
      <div className="flex justify-between">
        <div className="flex pl-10">
          <div className="nft-name font-semibold text-3xl">
            {collectionInfo[0]?.name}
          </div>
          <Tooltip target=".verified-nft" position="right" />
          <i
            className="verified-nft pi pi-verified text-sky-600 text-lg pl-2 pt-3"
            role="button"
            data-pr-tooltip="This collection belongs to a verified account and has significant interest or sales."
          />
        </div>
        <div className="detail-link">
          <div className="flex gap-10 pt-4 text-lg">
            <Tooltip target=".icon-etherscan" position="top" />
            <i
              className="icon-etherscan pi pi-chart-line"
              data-pr-tooltip="View on Etherscan"
              role="button"
            />

            <Tooltip target=".icon-website" position="top" />
            <i
              role="button"
              className="icon-website pi pi-globe"
              data-pr-tooltip="Website"
            />

            <Tooltip target=".icon-facebook" position="top" />
            <i
              role="button"
              className="icon-facebook pi pi-facebook"
              data-pr-tooltip="Facebook"
            />

            <Tooltip target=".icon-share" position="top" />
            <i
              role="button"
              className="icon-share pi pi-share-alt"
              data-pr-tooltip="Share"
            />

            <Tooltip target=".icon-watch-list" position="top" />
            <i
              role="button"
              className="icon-watch-list pi pi-star"
              data-pr-tooltip="Add to watchlist"
            />

            <i role="button" className="pi pi-ellipsis-h" />
          </div>
        </div>
      </div>
      {/* <div className="nft-author pt-3">
        By <span className="font-semibold">GEMMA-Factory </span>
      </div> */}
      <div className="flex detail-infor pt-3 text-lg">
        <div>
          Items{" "}
          <span className="font-semibold pr-1">
            {/* {nftCollectionList?.length || 0} */}
          </span>
        </div>
        ·
        <div className="pl-1">
          Created{" "}
          <span className="font-semibold pr-1">
            {collectionInfo[0]?.created_at.toString()}
          </span>
        </div>
        {/* ·
        <div className="pl-1">
          Creator earnings <span className="font-semibold pr-1">7.5%</span>
        </div> */}
        ·
        <div className="pl-1">
          Chain <span className="font-semibold pr-1">Ethereum</span>
        </div>
        ·
        <div className="pl-1">
          Category{" "}
          <span className="font-semibold">{collectionInfo[0]?.category}</span>
        </div>
      </div>
      <div className="nft-intro pt-3">
        <p
          className={
            "w-3/5 " +
            (!isSeeMore
              ? "whitespace-nowrap overflow-hidden text-ellipsis"
              : "")
          }
        >
          {collectionInfo[0]?.description}
        </p>
        <button onClick={handleClickToRead} className="hover:opacity-80">
          {!isSeeMore ? "See More" : "See Less"}{" "}
          <span className="text-xs">
            <i
              className={!isSeeMore ? "pi pi-angle-down" : "pi pi-angle-up"}
            ></i>
          </span>
        </button>
      </div>
      {/* <div className="nft-statistics pt-4">
        <div className="flex gap-5">
          <div className="flex flex-col" role="button">
            <div className="font-semibold text-lg"> ETH</div>
            <div className="text-sm text-slate-500">total volume</div>
          </div>
          <div className="flex flex-col" role="button">
            <div className="font-semibold text-lg"> ETH</div>
            <div className="text-sm text-slate-500">floor price</div>
          </div>
          <div className="flex flex-col" role="button">
            <div className="font-semibold text-lg">0.1527 WETH</div>
            <div className="text-sm text-slate-500">best offer</div>
          </div>
          <div className="flex flex-col" role="button">
            <div className="font-semibold text-lg">5%</div>
            <div className="text-sm text-slate-500">listed</div>
          </div>
          <div className="flex flex-col" role="button">
            <div className="font-semibold text-lg">2,412</div>
            <div className="text-sm text-slate-500">owners</div>
          </div>
          <div className="flex flex-col" role="button">
            <div className="font-semibold text-lg">60%</div>
            <div className="text-sm text-slate-500">unique owners</div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default NFTInfor;
