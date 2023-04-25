import NFTCollectionList from "@Components/NFTCollectionList/NFTCollectionList";
import ImageProfile from "@Components/NFTProfile/ImageProfile";
import NFTInfor from "@Components/NFTProfile/NFTInfor";
import { NFT_COLLECTION_MODE } from "@Constants/index";
import { useRef, useState } from "react";
import { Toast } from "primereact/toast";
import useNFTCollectionList from "@Hooks/useNFTCollectionList";
import { useRouter } from "next/router";
import useCollectionByToken from "@Hooks/useCollectionByToken";

const NFTCollectionContainer = () => {
  const router = useRouter();
  const [countFetch, setCountFetch] = useState<number>(0);
  const { collection } = useCollectionByToken(router.query.token);
  const { nftCollectionList } = useNFTCollectionList({
    token: router.query.token as string,
    countFetch,
  });

  const toast = useRef<Toast>(null);
  return (
    <>
      <Toast ref={toast} position="top-center" />
      <ImageProfile collectionImage={collection}></ImageProfile>
      <NFTInfor collectionInfo={collection}></NFTInfor>
      <NFTCollectionList
        nftCollectionList={nftCollectionList}
        mode={NFT_COLLECTION_MODE.CAN_BUY}
        setCountFetch={setCountFetch}
      />
    </>
  );
};

export default NFTCollectionContainer;
