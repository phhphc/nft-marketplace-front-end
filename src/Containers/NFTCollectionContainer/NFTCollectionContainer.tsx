import NFTCollectionList from "@Components/NFTCollectionList/NFTCollectionList";
import ImageProfile from "@Components/NFTProfile/ImageProfile";
import NFTInfor from "@Components/NFTProfile/NFTInfor";
import { NFT_COLLECTION_MODE } from "@Constants/index";
import {
  getNFTCollectionListService,
  getOfferByToken,
} from "@Services/ApiService";
import { useState, useEffect, useRef } from "react";
import { INFTCollectionItem } from "@Interfaces/index";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";

const NFTCollectionContainer = () => {
  const [nftCollectionList, setNftCollectionList] = useState<
    INFTCollectionItem[]
  >([]);
  const [countFetchNftCollectionList, setCountFetchNftCollectionList] =
    useState<number>(0);

  const toast = useRef<Toast>(null);
  const router = useRouter();

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
          console.log(newData);
          setNftCollectionList(newData);
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
  }, [countFetchNftCollectionList, router]);
  return (
    <>
      <Toast ref={toast} position="top-center" />
      <ImageProfile nftCollectionList={nftCollectionList}></ImageProfile>
      <NFTInfor nftCollectionList={nftCollectionList}></NFTInfor>
      <NFTCollectionList
        nftCollectionList={nftCollectionList}
        mode={NFT_COLLECTION_MODE.CAN_BUY}
        setCountFetchNftCollectionList={setCountFetchNftCollectionList}
      />
    </>
  );
};

export default NFTCollectionContainer;
