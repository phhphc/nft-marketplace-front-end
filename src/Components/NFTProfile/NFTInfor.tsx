import "primeicons/primeicons.css";
import { Tooltip } from "primereact/tooltip";
import { useContext, useEffect, useMemo, useState } from "react";
import { ICollectionItem, INFTCollectionItem } from "@Interfaces/index";
import moment from "moment";
import { Message } from "primereact/message";
import { isApprovedForAll, setApprovedForAll } from "@Services/ApiService";
import { AppContext } from "@Store/index";
import { erc721Abi } from "@Constants/erc721Abi";
import useNFTActivity from "@Hooks/useNFTActivity";
import { useRouter } from "next/router";

export interface ICollectionInfoProps {
  collectionInfo: ICollectionItem[];
  nftCollectionList: INFTCollectionItem[][];
}

const NFTInfor = ({
  collectionInfo,
  nftCollectionList,
}: ICollectionInfoProps) => {
  const [isSeeMore, setIsSeeMore] = useState(false);
  const handleClickToRead = () => {
    setIsSeeMore(!isSeeMore);
  };
  const [isApprovedForAllNfts, setApprovalForAllNfts] = useState(false);
  const [refetch, setRefetch] = useState<number>(0);
  const web3Context = useContext(AppContext);
  const mkpAddress = process.env.NEXT_PUBLIC_MKP_ADDRESS!;
  const router = useRouter();
  const token = router.query.token as string;
  const { nftActivity, refetch: nftActivityRefetch } = useNFTActivity({
    token: token,
  });

  useEffect(() => {
    const handleApprovalForAllNfts = async () => {
      if (
        web3Context.state.web3.provider &&
        web3Context.state.web3.myWallet &&
        web3Context.state.web3.myAddress &&
        collectionInfo[0]
      ) {
        const isApproved = await isApprovedForAll({
          contractAddress: collectionInfo[0]?.token,
          myAddress: web3Context.state.web3.myAddress,
          myWallet: web3Context.state.web3.myWallet,
          provider: web3Context.state.web3.provider,
          contractAbi: erc721Abi,
          mkpAddress: mkpAddress,
        });
        setApprovalForAllNfts(isApproved);
      }
    };
    handleApprovalForAllNfts();
  }, [collectionInfo[0], refetch]);

  const handleSetApproval = async () => {
    try {
      await setApprovedForAll({
        contractAddress: collectionInfo[0]?.token,
        contractAbi: erc721Abi,
        myWallet: web3Context.state.web3.myWallet,
        provider: web3Context.state.web3.provider,
        mkpAddress: mkpAddress,
        isApproved: true,
      });
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Set permission successfully!",
          life: 5000,
        });
      setRefetch((prev) => prev + 1);
    } catch (error) {
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to set permission!",
          life: 5000,
        });
    }
  };

  const handleCancelApproval = async () => {
    try {
      await setApprovedForAll({
        contractAddress: collectionInfo[0]?.token,
        contractAbi: erc721Abi,
        myWallet: web3Context.state.web3.myWallet,
        provider: web3Context.state.web3.provider,
        mkpAddress: mkpAddress,
        isApproved: false,
      });
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Widthraw permission successfully!",
          life: 5000,
        });
      setRefetch((prev) => prev + 1);
    } catch (error) {
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to widthraw permission!",
          life: 5000,
        });
    }
  };

  const totalVolume = useMemo(() => {
    let total = 0;
    let saleList = nftActivity.filter((act) => act.name === "sale");
    let salePriceList = saleList.map((sale) => Number(sale.price));
    for (let price of salePriceList) {
      total += price;
    }
    return total / 1000000000000000000;
  }, [nftActivity]);

  const floorPrice = useMemo(() => {
    const priceList: number[] = [];
    nftCollectionList.forEach((nft) => {
      let price = Number(nft[0]?.listings[0]?.end_price);
      if (!Number.isNaN(price)) {
        priceList.push(price);
      }
    });
    if (priceList.length > 0) {
      return Math.min(...priceList) / 1000000000000000000;
    }
    return NaN;
  }, [nftCollectionList]);

  const bestOfferPrice = useMemo(() => {
    let offerList = nftActivity.filter((act) => act.name === "offer");
    let offerPriceList = offerList.map((offer) => Number(offer.price));
    if (offerPriceList.length > 0) {
      return Math.max(...offerPriceList) / 1000000000000000000;
    }
    return NaN;
  }, [nftActivity]);

  const listed = useMemo(() => {
    let listedNft = nftCollectionList.filter(
      (nft) => nft[0].listings.length > 0
    );
    return Math.round((listedNft.length / nftCollectionList.length) * 100);
  }, [nftCollectionList]);

  const ownerCount = useMemo(() => {
    let ownList = Array.from(
      new Set(nftCollectionList.map((nft) => nft[0].owner))
    );
    return ownList.length;
  }, [nftCollectionList]);

  const uniqueOwner = useMemo(() => {
    return Math.round((ownerCount / nftCollectionList.length) * 100);
  }, [ownerCount, nftCollectionList]);

  return (
    <div id="nft-infor">
      <div className="flex justify-between">
        <div className="nft-name font-semibold text-3xl pl-8">
          {collectionInfo[0]?.name}
        </div>
      </div>
      {/* <div className="nft-author pt-3">
        By <span className="font-semibold">GEMMA-Factory </span>
      </div> */}
      <div className="flex pt-3 justify-between">
        <div className="flex detail-infor pt-3 text-lg">
          {" "}
          <div className="">
            Created{" "}
            <span className="font-semibold pr-1">
              {moment(collectionInfo[0]?.created_at).format("MMMM Do YYYY")}
            </span>
          </div>
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

        {isApprovedForAllNfts ? (
          <div>
            <Message
              severity="info"
              text="You gave the marketplace permission to transfer all your NFTs. Click here to withdraw!"
              className="approved cursor-pointer"
              data-pr-tooltip="You won't pay extra ETH for the next time"
              data-pr-position="left"
              onClick={() => handleCancelApproval()}
            />
            <Tooltip target=".approved" />
          </div>
        ) : (
          <div>
            <button
              className="bg-sky-500 hover:bg-sky-700 text-white rounded-md h-14 w-80 not-approved"
              onClick={() => handleSetApproval()}
              data-pr-tooltip="Once you set permission, you won't pay extra ETH for the next time"
              data-pr-position="left"
            >
              Set permission for the marketplace to transfer all your NFTs
            </button>
            <Tooltip target=".not-approved" />
          </div>
        )}
      </div>
      <div className="flex pt-3 justify-between">
        <div className="">
          Items{" "}
          <span className="font-semibold pr-1">{nftCollectionList.length}</span>
        </div>
        <div className="pl-1">
          Total Volume{" "}
          <span className="font-semibold pr-1">{totalVolume} ETH</span>
        </div>
        <div className="pl-1">
          Floor Price
          <span className="font-semibold pr-1 pl-1">
            {Number.isNaN(floorPrice) ? "--" : floorPrice + " ETH"}
          </span>
        </div>
        <div className="pl-1">
          Best Offer
          <span className="font-semibold pr-1 pl-1">
            {Number.isNaN(bestOfferPrice) ? "--" : bestOfferPrice + " ETH"}
          </span>
        </div>
        <div className="pl-1">
          Listed
          <span className="font-semibold pr-1 pl-1">
            {Number.isNaN(listed) ? 0 : listed}%
          </span>
        </div>
        <div className="pl-1">
          Owner
          <span className="font-semibold pr-1 pl-1">{ownerCount}</span>
        </div>
        <div className="pl-1">
          Unique Owner
          <span className="font-semibold pr-1 pl-1">
            {Number.isNaN(uniqueOwner) ? 0 : uniqueOwner}%
          </span>
        </div>
      </div>
      <div className="pt-3">
        <p
          className={
            "w-1/2 " +
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
    </div>
  );
};

export default NFTInfor;
