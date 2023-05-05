import NFTDetail from "@Components/NFTDetail/NFTDetail";
import { useState, useEffect, useRef, useContext } from "react";
import { INFTCollectionItem } from "@Interfaces/index";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";
import useNFTCollectionList from "@Hooks/useNFTCollectionList";
import useNFTActivity from "@Hooks/useNFTActivity";

const NFTDetailContainer = () => {
  const { nftCollectionList, refetch } = useNFTCollectionList({});
  const [nftDetail, setNftDetail] = useState<INFTCollectionItem[]>();

  const toast = useRef<Toast>(null);

  const router = useRouter();
  const tokenID = router.query.token_id as string;

  const { nftActivity, refetch: nftActivityRefetch } = useNFTActivity({
    token_id: tokenID,
  });

  useEffect(() => {
    tokenID &&
      setNftDetail(
        nftCollectionList.filter((item: INFTCollectionItem[]) =>
          item.map((nft) => nft.identifier).includes(tokenID)
        )[0]
      );
  }, [nftCollectionList.length]);

  return (
    <>
      {nftDetail && (
        <>
          <Toast ref={toast} position="top-center" />
          <NFTDetail nftDetail={nftDetail} refetch={refetch} nftActivity={nftActivity} nftActivityRefetch={nftActivityRefetch}/>
        </>
      )}
    </>
  );
};

export default NFTDetailContainer;
