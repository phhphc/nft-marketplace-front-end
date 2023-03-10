import NFTCollectionList from "@Components/NFTCollectionList/NFTCollectionList";
import ImageProfile from "@Components/NFTProfile/ImageProfile";
import NFTInfor from "@Components/NFTProfile/NFTInfor";
import { NFT_COLLECTION_MODE } from "@Constants/index";
import {
  getNFTCollectionListInfoService,
  getOfferByToken,
} from "@Services/ApiService";
import { useState, useEffect, useRef } from "react";
import { INFTCollectionItem } from "@Interfaces/index";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";

const NFTCollectionContainer = () => {
  const [nftCollectionList, setNftCollectionList] = useState<
    INFTCollectionItem[]
  >([]);
  const [countFetchNftCollectionList, setCountFetchNftCollectionList] =
    useState<number>(0);

  const toast = useRef<Toast>(null);
  const router = useRouter();

  useEffect(() => {
    getNFTCollectionListInfoService({ toast, callback: setNftCollectionList });
  }, [countFetchNftCollectionList, router]);
  return (
    <>
      <Toast ref={toast} position="top-center" />
      <ImageProfile nftCollectionList={nftCollectionList}></ImageProfile>
      <NFTInfor nftCollectionList={nftCollectionList}></NFTInfor>
      <NFTCollectionList
        nftCollectionList={nftCollectionList}
        mode={NFT_COLLECTION_MODE.CAN_BUY}
        setCountFetchNftCollectionList={setCountFetchNftCollectionList}
      />
    </>
  );
};

export default NFTCollectionContainer;
