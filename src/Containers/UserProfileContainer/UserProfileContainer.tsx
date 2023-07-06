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
import moment from "moment";
import { CHANGE_STATISTICS_CMD } from "./constant";

const UserProfileContainer = () => {
  const web3Context = useContext(AppContext);
  const [statisticsInterval, setStatisticsInterval] = useState(() => {
    const startDate = new Date(
      moment().subtract(30, "days").toLocaleString()
    ).toLocaleDateString("en-CA");
    const endDate = new Date().toLocaleDateString("en-CA");
    return {
      startDate,
      endDate,
    };
  });

  const handleChangeStatisticsInterval = (
    cmd: CHANGE_STATISTICS_CMD,
    date: string
  ) => {
    if (cmd === CHANGE_STATISTICS_CMD.START_DATE) {
      if (new Date(date) <= new Date(statisticsInterval.endDate)) {
        setStatisticsInterval((prev) => ({ ...prev, startDate: date }));
      }
    } else {
      if (new Date(statisticsInterval.startDate) <= new Date(date)) {
        setStatisticsInterval((prev) => ({ ...prev, endDate: date }));
      }
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
    startDate: statisticsInterval.startDate,
    endDate: statisticsInterval.endDate,
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
              profileRefetch={profileRefetch}></UserInfor>
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
              statisticsInterval={statisticsInterval}
              handleChangeStatisticsInterval={
                handleChangeStatisticsInterval
              }></UserProfileTabs>
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
