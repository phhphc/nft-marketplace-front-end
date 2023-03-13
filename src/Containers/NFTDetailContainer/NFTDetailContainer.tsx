import NFTDetail from "@Components/NFTDetail/NFTDetail";
import { useState, useEffect, useContext, useRef } from "react";
import { INFTCollectionItem } from "@Interfaces/index";
import { AppContext } from "@Store/index";
import {
  getNFTCollectionListService,
  getOfferByToken,
} from "@Services/ApiService";
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
      try {
        const data = await getNFTCollectionListService();
        if (data) {
          const newData = await Promise.all(
            data.nfts.map(async (item: any) => {
              const orderParameters = await getOfferByToken({
                tokenId: item.token_id,
                tokenAddress: item.contract_addr,
              });
              if (orderParameters?.length) {
                const signature = orderParameters[0].signature;
                delete orderParameters[0].signature;
                delete orderParameters[0].is_cancelled;
                delete orderParameters[0].is_validated;
                return {
                  ...item,
                  order: {
                    parameters: orderParameters[0],
                    signature,
                  },
                };
              } else return item;
            })
          );
          setNftDetail(
            newData.filter((item: any) => item.token_id == tokenID)[0]
          );
        }
      } catch (err) {
        toast.current &&
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Fail to load collections",
            life: 3000,
          });
      }
    };

    fetchData();
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
