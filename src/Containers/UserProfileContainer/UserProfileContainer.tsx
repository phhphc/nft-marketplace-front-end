import NFTUserProfileTabs from "@Components/NFTUserProfileTabs/NFTUserProfileTabs";
import NFTImageUserProfile from "@Components/UserProfile/NFTImageUserProfile";
import UserInfor from "@Components/UserProfile/UserInfor";
import {
  getNFTCollectionListService,
  getOfferByToken,
} from "@Services/ApiService";
import { useState, useEffect, useContext, useRef } from "react";
import { INFTCollectionItem } from "@Interfaces/index";
import { AppContext } from "@Store/index";
import { Toast } from "primereact/toast";
import { useRouter } from "next/router";

const UserProfileContainer = () => {
  const [nftCollectionList, setNftCollectionList] = useState<
    INFTCollectionItem[]
  >([]);

  const router = useRouter();

  const [countFetchNftCollectionList, setCountFetchNftCollectionList] =
    useState<number>(0);

  const toast = useRef<Toast>(null);

  const web3Context = useContext(AppContext);
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
  }, [countFetchNftCollectionList, web3Context.state.web3.myAddress, router]);

  return (
    <>
      {web3Context.state.web3.provider ? (
        <>
          <div>
            <Toast ref={toast} position="top-center" />
            <NFTImageUserProfile></NFTImageUserProfile>
            <UserInfor></UserInfor>
            <NFTUserProfileTabs
              nftCollectionList={nftCollectionList}
              setCountFetchNftCollectionList={setCountFetchNftCollectionList}
            />
          </div>
        </>
      ) : (
        <>Please login</>
      )}
    </>
  );
};

export default UserProfileContainer;
