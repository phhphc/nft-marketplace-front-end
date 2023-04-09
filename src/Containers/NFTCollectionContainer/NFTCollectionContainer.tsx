import NFTCollectionList from "@Components/NFTCollectionList/NFTCollectionList";
import ImageProfile from "@Components/NFTProfile/ImageProfile";
import NFTInfor from "@Components/NFTProfile/NFTInfor";
import { NFT_COLLECTION_MODE } from "@Constants/index";
import { useRef } from "react";
import { Toast } from "primereact/toast";
import useNFTCollectionList from "@Hooks/useNFTCollectionList";
import { useRouter } from "next/router";
import useCollectionByToken from "@Hooks/useCollectionByToken";
import { INFTCollectionItem } from "@Interfaces/index";

const NFTCollectionContainer = () => {
  const { nftCollectionList } = useNFTCollectionList();
  const router = useRouter();
  const { collection } = useCollectionByToken(router.query.token);
  
  const nftList = nftCollectionList.filter(
    (nft: INFTCollectionItem[]) => nft[0].token === router.query.token
  );
  console.log('nftList',nftList);
  const toast = useRef<Toast>(null);
  return (
    <>
      <Toast ref={toast} position="top-center" />
      <ImageProfile collectionImage={collection}></ImageProfile>
      <NFTInfor collectionInfo={collection}></NFTInfor>
      <NFTCollectionList
        nftCollectionList={nftList}
        mode={NFT_COLLECTION_MODE.CAN_BUY}
      />
    </>
  );
};

export default NFTCollectionContainer;
