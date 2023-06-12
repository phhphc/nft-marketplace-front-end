import NFTDetail from "@Components/NFTDetail/NFTDetail";
import { useState, useEffect, useRef, useContext, useMemo } from "react";
import { INFTCollectionItem } from "@Interfaces/index";
import { useRouter } from "next/router";
import useNFTCollectionList from "@Hooks/useNFTCollectionList";
import useNFTActivity from "@Hooks/useNFTActivity";
import { AppContext } from "@Store/index";

const NFTDetailContainer = () => {
  const web3Context = useContext(AppContext);
  const { nftCollectionList, refetch } = useNFTCollectionList({
    provider: web3Context.state.web3.provider,
    myWallet: web3Context.state.web3.myWallet,
    chainId: web3Context.state.web3.chainId,
  });

  const router = useRouter();
  const tokenID = router.query.token_id as string;

  const { nftActivity, refetch: nftActivityRefetch } = useNFTActivity({
    token_id: tokenID,
    chainId: web3Context.state.web3.chainId,
  });

  const nftDetail = useMemo(() => {
    return tokenID
      ? nftCollectionList.filter((item: INFTCollectionItem[]) =>
          item.map((nft) => nft.identifier).includes(tokenID)
        )[0]
      : [];
  }, [nftCollectionList, tokenID]);

  return (
    <>
      {nftDetail && (
        <>
          <NFTDetail
            nftDetail={nftDetail}
            refetch={refetch}
            nftActivity={nftActivity}
            nftActivityRefetch={nftActivityRefetch}
          />
        </>
      )}
    </>
  );
};

export default NFTDetailContainer;
