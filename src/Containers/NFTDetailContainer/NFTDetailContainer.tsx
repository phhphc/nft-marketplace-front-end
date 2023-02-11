import NFTDetail from "@Components/NFTDetail/NFTDetail";
import { useState, useEffect, useContext, useRef } from "react";
import { INFTCollectionItem } from "@Interfaces/index";
import { AppContext } from "@Store/index";
import { getNFTCollectionListService } from "@Services/ApiService";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";

const NFTDetailContainer = () => {
  const [nftDetail, setNftDetail] = useState<INFTCollectionItem>();

  const toast = useRef<Toast>(null);

  const web3Context = useContext(AppContext);
  const router = useRouter();
  const tokenID = router.query.token_id;

  useEffect(() => {
    const fetchData = async () => {
      getNFTCollectionListService().then((data) => {
        if (data) {
          const nftList = data.nfts;
          setNftDetail(
            nftList.filter((item: any) => item.token_id == tokenID)[0]
          );
        } else {
          toast.current &&
            toast.current.show({
              severity: "error",
              summary: "Error",
              detail: "Fail to load NFT information",
              life: 3000,
            });
        }
      });
    };
    fetchData();
  }, [router]);

  return (
    <>
      {web3Context.state.web3.provider && nftDetail ? (
        <>
          <Toast ref={toast} position="bottom-right" />
          <NFTDetail nftDetail={nftDetail} />
        </>
      ) : (
        <>Please login</>
      )}
    </>
  );
};

export default NFTDetailContainer;
