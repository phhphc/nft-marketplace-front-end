import NFTDetail from "@Components/NFTDetail/NFTDetail";
import { useState, useEffect, useContext, useRef } from "react";
import { INFTCollectionItem } from "@Interfaces/index";
import { AppContext } from "@Store/index";
import { getNFTCollectionListInfoService } from "@Services/ApiService";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";

const NFTDetailContainer = () => {
  const [nftDetail, setNftDetail] = useState<INFTCollectionItem>();

  const toast = useRef<Toast>(null);

  const web3Context = useContext(AppContext);
  const router = useRouter();
  const tokenID = router.query.token_id;

  const handleSetNftDetail = (nftList: INFTCollectionItem[]) => {
    setNftDetail(nftList.filter((item: any) => item.token_id == tokenID)[0]);
  };

  useEffect(() => {
    getNFTCollectionListInfoService({ toast, callback: handleSetNftDetail });
  }, [router]);

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
