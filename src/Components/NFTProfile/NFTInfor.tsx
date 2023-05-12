import "primeicons/primeicons.css";
import { Tooltip } from "primereact/tooltip";
import { useContext, useEffect, useState } from "react";
import { ICollectionItem } from "@Interfaces/index";
import moment from "moment";
import { Message } from "primereact/message";
import { isApprovedForAll, setApprovedForAll } from "@Services/ApiService";
import { AppContext } from "@Store/index";
import { erc721Abi } from "@Constants/erc721Abi";

export interface ICollectionInfoProps {
  collectionInfo: ICollectionItem[];
}

const NFTInfor = ({ collectionInfo }: ICollectionInfoProps) => {
  const [isSeeMore, setIsSeeMore] = useState(false);
  const handleClickToRead = () => {
    setIsSeeMore(!isSeeMore);
  };
  const [isApprovedForAllNfts, setApprovalForAllNfts] = useState(false);
  const [refetch, setRefetch] = useState<number>(0);
  const web3Context = useContext(AppContext);
  const mkpAddress = process.env.NEXT_PUBLIC_MKP_ADDRESS!;

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
          detail: "Set approval successfully!",
          life: 5000,
        });
      setRefetch((prev) => prev + 1);
    } catch (error) {
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to set approval!",
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
          detail: "Cancel approval successfully!",
          life: 5000,
        });
      setRefetch((prev) => prev + 1);
    } catch (error) {
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to cancel approval!",
          life: 5000,
        });
    }
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
          {/* <div>
          Items{" "}
          <span className="font-semibold pr-1">
          </span>
        </div>
        · */}
          <div className="">
            Created{" "}
            <span className="font-semibold pr-1">
              {moment(collectionInfo[0]?.created_at).format("MMMM Do YYYY")}
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

        {isApprovedForAllNfts ? (
          <div>
            <Message
              severity="info"
              text="You approved to sell for all your NFTs. You can click here to cancel!"
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
              className="bg-sky-500 hover:bg-sky-700 text-white rounded-md h-10 w-72 not-approved"
              onClick={() => handleSetApproval()}
              data-pr-tooltip="Once you set approval, you won't pay extra ETH for the next time"
              data-pr-position="left"
            >
              Set approval to sell for all your NFTs
            </button>
            <Tooltip target=".not-approved" />
          </div>
        )}
      </div>
      <div className="pt-3">
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
