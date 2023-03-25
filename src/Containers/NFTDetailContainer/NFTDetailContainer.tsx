import NFTDetail from "@Components/NFTDetail/NFTDetail";
import { useState, useEffect, useRef } from "react";
import { INFTCollectionItem } from "@Interfaces/index";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";
import useNFTCollectionList from "@Hooks/useNFTCollectionList";

const NFTDetailContainer = () => {
  const { nftCollectionList } = useNFTCollectionList();
  const [nftDetail, setNftDetail] = useState<INFTCollectionItem>();

  const toast = useRef<Toast>(null);

  const router = useRouter();
  const tokenID = router.query.identifier;

  useEffect(() => {
    setNftDetail(
      nftCollectionList.filter((item: any) => item.identifier == tokenID)[0]
    );
  }, [nftCollectionList]);

  return (
    <>
      {nftDetail && (
        <>
          <Toast ref={toast} position="top-center" />
          <NFTDetail nftDetail={nftDetail} />
        </>
      )}
    </>
  );
};

export default NFTDetailContainer;
