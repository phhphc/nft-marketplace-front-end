import { IOfferItem } from "@Interfaces/index";
import { getOfferList } from "@Services/ApiService";
import { cloneDeep } from "lodash";
import { useQuery } from "react-query";

const useOfferReceivedList = (owner: string, chainId: number) => {
  const result = useQuery({
    queryKey: ["OfferReceivedList", owner],
    queryFn: () => getOfferList({ owner: owner, chainId }),
    staleTime: Infinity,
  });
  // const offerReceivedList = result.data || [];

  const offerReceivedList: IOfferItem[] =
    result.data
      ?.filter((offer) => offer.from !== offer.owner)
      .map((offer) => {
        return cloneDeep({
          ...offer,
          status: offer.is_fulfilled
            ? "fulfilled"
            : offer.is_expired
            ? "expired"
            : offer.is_cancelled
            ? "cancelled"
            : "none",
        });
      }) || [];

  return { ...result, offerReceivedList };
};

export default useOfferReceivedList;
