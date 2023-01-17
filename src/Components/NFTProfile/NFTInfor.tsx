import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faChevronUp,
  faChevronDown,
  faGlobe,
  faChartSimple,
  faShareNodes,
  faStar,
  faEllipsis,
} from "@fortawesome/free-solid-svg-icons";
import { Tooltip, Button } from "@material-tailwind/react";
import { useState } from "react";

const NFTInfor = () => {
  const [isSeeMore, setIsSeeMore] = useState(false);
  const handleClickToRead = () => {
    setIsSeeMore(!isSeeMore);
  };
  return (
    <div id="nft-infor">
      <div className="flex justify-between">
        <div className="flex">
          <div className="nft-name font-semibold text-3xl">
            GEMMA BY TRISTAN EATON
          </div>
          <Tooltip
            className="bg-slate-800 w-56 text-center rounded-lg p-1"
            content="This collection belongs to a verified account and has significant interest or sales."
            placement="right"
          >
            <Button variant="gradient">
              <FontAwesomeIcon
                type="button"
                className="text-sky-500 text-lg pl-2 pt-2"
                icon={faCheckCircle}
              />
            </Button>
          </Tooltip>
        </div>
        <div className="detail-link">
          <div className="flex gap-10 pt-4 text-lg">
            <Tooltip
              className="bg-slate-800 text-center rounded-lg p-1"
              content="View on Etherscan"
              placement="top"
            >
              <FontAwesomeIcon icon={faChartSimple} role="button" />
            </Tooltip>

            <Tooltip
              className="bg-slate-800 text-center rounded-lg p-1"
              content="Website"
              placement="top"
            >
              <FontAwesomeIcon icon={faGlobe} role="button" />
            </Tooltip>

            <Tooltip
              className="bg-slate-800 text-center rounded-lg p-1"
              content="Share"
              placement="top"
            >
              <FontAwesomeIcon icon={faShareNodes} role="button" />
            </Tooltip>

            <Tooltip
              className="bg-slate-800 text-center rounded-lg p-1"
              content="Add to watchlist"
              placement="top"
            >
              <FontAwesomeIcon icon={faStar} role="button" />
            </Tooltip>

            <FontAwesomeIcon icon={faEllipsis} role="button" />
          </div>
        </div>
      </div>
      <div className="nft-author pt-3">
        By{" "}
        <span className="font-semibold">
          GEMMA-Factory{" "}
          <span>
            <Tooltip
              className="bg-slate-800 w-56 text-center rounded-lg p-1"
              content="This is a verified account."
              placement="right"
            >
              <Button variant="gradient">
                <FontAwesomeIcon
                  type="button"
                  className="text-sky-500 text-sm"
                  icon={faCheckCircle}
                />
              </Button>
            </Tooltip>
          </span>
        </span>
      </div>
      <div className="flex detail-infor pt-3 text-lg">
        <div>
          Items <span className="font-semibold pr-1">4,041</span>
        </div>
        ·
        <div className="pl-1">
          Created <span className="font-semibold pr-1">Jan 2022</span>
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
            <FontAwesomeIcon icon={!isSeeMore ? faChevronDown : faChevronUp} />
          </span>
        </button>
      </div>
      <div className="nft-statistics pt-4">
        <div className="flex gap-5">
          <div className="flex flex-col" role="button">
            <div className="font-semibold text-lg">1,096 ETH</div>
            <div className="text-sm text-slate-500">total volume</div>
          </div>
          <div className="flex flex-col" role="button">
            <div className="font-semibold text-lg">0.2 ETH</div>
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
