import NFTCollectionList from "@Components/NFTCollectionList/NFTCollectionList";
import ImageProfile from "@Components/NFTProfile/ImageProfile";
import NFTInfor from "@Components/NFTProfile/NFTInfor";
import { NFT_COLLECTION_MODE } from "@Constants/index";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import useNFTCollectionList from "@Hooks/useNFTCollectionList";

const NFTCollectionContainer = () => {
  const { nftCollectionList } = useNFTCollectionList();
  const toast = useRef<Toast>(null);

  return (
    <>
      <Toast ref={toast} position="top-center" />
      <ImageProfile nftCollectionList={nftCollectionList}></ImageProfile>
      <NFTInfor nftCollectionList={nftCollectionList}></NFTInfor>
      <NFTCollectionList
        nftCollectionList={nftCollectionList}
        mode={NFT_COLLECTION_MODE.CAN_BUY}
      />
    </>
  );
};

export default NFTCollectionContainer;
