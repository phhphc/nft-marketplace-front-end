import OfferReceivedList from "@Components/OfferReceivedList/OfferReceivedList";
import NFTActivity from "@Components/NFTActivity/NFTActivity";
import NFTUserProfileTabs from "@Components/NFTUserProfileTabs/NFTUserProfileTabs";
import {
  IMakeOfferItem,
  INFTActivity,
  INFTCollectionItem,
  IOfferItem,
} from "@Interfaces/index";
import { TabView, TabPanel } from "primereact/tabview";
import OfferMadeList from "@Components/OfferMadeList/OfferMadeList";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export interface IUserProfileTabsProps {
  nftCollectionList: INFTCollectionItem[][];
  refetch: () => void;
  offerReceivedList: IOfferItem[];
  offerReceivedListRefetch: () => void;
  offerMadeList: IOfferItem[];
  offerMadeListRefetch: () => void;
  nftRefetch: () => void;
  nftActivity: INFTActivity[];
  nftActivityRefetch: () => void;
}

const UserProfileTabs = ({
  nftCollectionList,
  refetch,
  offerReceivedList,
  offerReceivedListRefetch,
  offerMadeList,
  offerMadeListRefetch,
  nftRefetch,
  nftActivity,
  nftActivityRefetch,
}: IUserProfileTabsProps) => {
  const router = useRouter();

  useEffect(() => {
    if (router.query.notif === "offer_received") {
      window.scrollTo({
        behavior: "smooth",
        top: 500,
      });
    }
  });

  return (
    <div className="mt-5">
      <TabView activeIndex={router.query.notif === "offer_received" ? 2 : 0}>
        <TabPanel header="My NFTs">
          <NFTUserProfileTabs
            nftCollectionList={nftCollectionList}
            refetch={refetch}
          />
        </TabPanel>
        <TabPanel header="My Activities">
          <NFTActivity nftActivity={nftActivity}></NFTActivity>
        </TabPanel>
        <TabPanel header="Offers received">
          <OfferReceivedList
            offerReceivedList={offerReceivedList}
            offerReceivedListRefetch={offerReceivedListRefetch}
            nftActivityRefetch={nftActivityRefetch}
            nftRefetch={refetch}
          ></OfferReceivedList>
        </TabPanel>
        <TabPanel header="Offers made">
          <OfferMadeList
            offerMadeList={offerMadeList}
            offerMadeListRefetch={offerMadeListRefetch}
            nftActivityRefetch={nftActivityRefetch}
            nftRefetch={refetch}
          ></OfferMadeList>
        </TabPanel>
      </TabView>
    </div>
  );
};

export default UserProfileTabs;
