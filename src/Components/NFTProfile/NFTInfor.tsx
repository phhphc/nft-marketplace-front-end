import "primeicons/primeicons.css";
import { Tooltip } from "primereact/tooltip";
import { useState } from "react";
import { INFTCollectionItem } from "@Interfaces/index";
import { useMemo } from "react";

export interface INFTInforProps {
  nftCollectionList: INFTCollectionItem[];
}

const NFTInfor = ({ nftCollectionList }: INFTInforProps) => {
  const [isSeeMore, setIsSeeMore] = useState(false);
  const handleClickToRead = () => {
    setIsSeeMore(!isSeeMore);
  };

  const totalVolume = 50;
  // ERROR
  // const totalVolume = useMemo(() => {
  //   return Math.round(
  //     nftCollectionList.reduce(
  //       (acc, cur) => acc + (cur.listing?.price || 0),
  //       0
  //     ) / 1000000000000000000
  //   );
  // }, [nftCollectionList]);

  const floorPrice = useMemo(() => {
    return Math.round(
      (nftCollectionList
        ? Math.min(
            ...(nftCollectionList
              .filter((item) => !!item.listing)
              .map((item) => item.listing?.price) as any)
          )
        : 0) / 1000000000000000000
    );
  }, [nftCollectionList]);

  return (
    <div id="nft-infor">
      <div className="flex justify-between">
        <div className="flex">
          <div className="nft-name font-semibold text-3xl">
            GEMMA BY TRISTAN EATON
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
      <div className="nft-author pt-3">
        By <span className="font-semibold">GEMMA-Factory </span>
      </div>
      <div className="flex detail-infor pt-3 text-lg">
        <div>
          Items{" "}
          <span className="font-semibold pr-1">
            {nftCollectionList?.length || 0}
          </span>
        </div>
        ·
        <div className="pl-1">
          Created <span className="font-semibold pr-1">Feb 2023</span>
        </div>
        ·
        <div className="pl-1">
          Creator earnings <span className="font-semibold pr-1">7.5%</span>
        </div>
        ·
        <div className="pl-1">
          Chain <span className="font-semibold pr-1">Ethereum</span>
        </div>
        ·
        <div className="pl-1">
          Category <span className="font-semibold">PFPs</span>
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
          GEMMA (The Generative Electronic Museum of Metaverse Art) is a
          comprehensive generative art collection by Tristan Eaton. Combining
          Eaton’s stunning portraiture and layered collage, each piece carries
          its own unique personality and identity.
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
      <div className="nft-statistics pt-4">
        <div className="flex gap-5">
          <div className="flex flex-col" role="button">
            <div className="font-semibold text-lg">{totalVolume} ETH</div>
            <div className="text-sm text-slate-500">total volume</div>
          </div>
          <div className="flex flex-col" role="button">
            <div className="font-semibold text-lg">{floorPrice} ETH</div>
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
      </div>
    </div>
  );
};

export default NFTInfor;
