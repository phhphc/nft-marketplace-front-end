import NFTCollectionList from "@Components/NFTCollectionList/NFTCollectionList";
import ImageProfile from "@Components/NFTProfile/ImageProfile";
import NFTInfor from "@Components/NFTProfile/NFTInfor";
import { NFT_COLLECTION_MODE } from "@Constants/index";
import useNFTCollectionList from "@Hooks/useNFTCollectionList";
import { useRouter } from "next/router";
import useCollectionByToken from "@Hooks/useCollectionByToken";
import { useContext, useMemo } from "react";
import { AppContext } from "@Store/index";

const NFTCollectionContainer = () => {
  const router = useRouter();
  const web3Context = useContext(AppContext);
  const { collection } = useCollectionByToken(router.query.token);
  const { nftCollectionList, refetch } = useNFTCollectionList({
    token: router.query.token as string,
    isHidden: false,
    provider: web3Context.state.web3.provider,
    myWallet: web3Context.state.web3.myWallet,
  });

  return (
    <>
      <ImageProfile collectionImage={collection}></ImageProfile>
      <NFTInfor collectionInfo={collection} nftCollectionList={nftCollectionList}></NFTInfor>
      <NFTCollectionList
        nftCollectionList={nftCollectionList}
        mode={NFT_COLLECTION_MODE.CAN_BUY}
        refetch={refetch}
      />
    </>
  );
};

export default NFTCollectionContainer;
