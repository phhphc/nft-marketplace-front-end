import NFTUserProfileTabs from "@Components/NFTUserProfileTabs/NFTUserProfileTabs";
import NFTImageUserProfile from "@Components/UserProfile/NFTImageUserProfile";
import UserInfor from "@Components/UserProfile/UserInfor";
import { getNFTCollectionListService } from "@Services/ApiService";
import { useState, useEffect, useContext, useRef } from "react";
import { INFTCollectionItem } from "@Interfaces/index";
import { AppContext } from "@Store/index";
import { Toast } from "primereact/toast";

const UserProfileContainer = () => {
  const [nftCollectionList, setNftCollectionList] = useState<
    INFTCollectionItem[]
  >([]);

  const [countFetchNftCollectionList, setCountFetchNftCollectionList] =
    useState<number>(0);

  const toast = useRef<Toast>(null);

  const web3Context = useContext(AppContext);
  useEffect(() => {
    const fetchData = async () => {
      getNFTCollectionListService(web3Context.state.web3.myAddress).then(
        (res) => {
          if (res) {
            const nftsProfile = res.nfts.filter((item: any) => !item.listing);
            setNftCollectionList(nftsProfile);
          } else {
            toast.current &&
              toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Fail to load your collections",
                life: 3000,
              });
          }
        }
      );
    };
    fetchData();
  }, [countFetchNftCollectionList, web3Context.state.web3.myAddress]);

  return (
    <>
      {web3Context.state.web3.provider ? (
        <>
          <div>
            <Toast ref={toast} position="bottom-right" />
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
