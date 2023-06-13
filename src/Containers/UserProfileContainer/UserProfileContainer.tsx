import UserInfor from "@Components/UserProfile/UserInfor";
import { useContext, useRef, useState } from "react";
import { AppContext } from "@Store/index";
import useNFTCollectionList from "@Hooks/useNFTCollectionList";
import UserImage from "@Components/UserProfile/UserImage";
import useOfferReceivedList from "@Hooks/useOfferReceivedList";
import useProfile from "@Hooks/useProfile";
import UserProfileTabs from "@Components/UserProfileTabs/UserProfileTabs";
import useNFTActivityByOwner from "@Hooks/useNFTActivityByOwner";
import { Message } from "primereact/message";
import useOfferMadeList from "@Hooks/useOfferMadeList";
import useSaleEventByAddrMthYr from "@Hooks/useEventProfileStatistics";

const UserProfileContainer = () => {
  const web3Context = useContext(AppContext);
  const [monthYear, setMonthYear] = useState(() => {
    let today = new Date();
    return {
      month: today.getMonth() + 1,
      year: today.getFullYear(),
    };
  });
  const handleChangeMonthYear = (cmd: string) => {
    if (cmd === "next") {
      setMonthYear((prev) => {
        if (prev.month === 12) {
          return {
            month: 1,
            year: prev.year + 1,
          };
        }
        return {
          ...prev,
          month: prev.month + 1,
        };
      });
    } else if (cmd === "prev") {
      setMonthYear((prev) => {
        if (prev.month === 1) {
          return {
            month: 12,
            year: prev.year - 1,
          };
        }
        return {
          ...prev,
          month: prev.month - 1,
        };
      });
    }
  };

  const { nftCollectionList, refetch } = useNFTCollectionList({
    owner: web3Context.state.web3.myAddress as string,
    provider: web3Context.state.web3.provider,
    myWallet: web3Context.state.web3.myWallet,
    chainId: web3Context.state.web3.chainId,
  });

  const { offerReceivedList, refetch: offerReceivedListRefetch } =
    useOfferReceivedList(
      web3Context.state.web3.myAddress,
      web3Context.state.web3.chainId
    );

  const { offerMadeList, refetch: offerMadeListRefetch } = useOfferMadeList(
    web3Context.state.web3.myAddress,
    web3Context.state.web3.chainId
  );

  const { profile, refetch: profileRefetch } = useProfile(
    web3Context.state.web3.myAddress,
    web3Context.state.web3.chainId
  );

  const { nftActivity, refetch: nftActivityRefetch } = useNFTActivityByOwner(
    web3Context.state.web3.myAddress,
    web3Context.state.web3.chainId
  );

  const { nftSaleByMth, refetch: nftSaleRefetch } = useSaleEventByAddrMthYr({
    address: web3Context.state.web3.myAddress as string,
    month: monthYear.month,
    year: monthYear.year,
    chainId: web3Context.state.web3.chainId,
  });

  return (
    <>
      {web3Context.state.web3.provider ? (
        <>
          <div>
            <UserImage profile={profile}></UserImage>
            <UserInfor
              profile={profile}
              profileRefetch={profileRefetch}
            ></UserInfor>
            <UserProfileTabs
              nftCollectionList={nftCollectionList}
              refetch={refetch}
              offerReceivedList={offerReceivedList}
              offerReceivedListRefetch={offerReceivedListRefetch}
              offerMadeList={offerMadeList}
              offerMadeListRefetch={offerMadeListRefetch}
              nftRefetch={refetch}
              nftActivity={nftActivity}
              nftActivityRefetch={nftActivityRefetch}
              nftSaleByMonth={nftSaleByMth}
              nftSaleRefetch={nftSaleRefetch}
              monthYear={monthYear}
              handleChangeMonthYear={handleChangeMonthYear}
            ></UserProfileTabs>
          </div>
        </>
      ) : (
        <Message
          severity="warn"
          text="Please login your wallet!"
          className="flex h-40"
        />
      )}
    </>
  );
};

export default UserProfileContainer;
