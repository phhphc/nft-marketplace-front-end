import { IOfferItem } from "@Interfaces/index";
import { getOfferList } from "@Services/ApiService";
import { cloneDeep } from "lodash";
import { useQuery } from "react-query";

const useOfferMadeList = (owner: string, chainId: number) => {
  const result = useQuery({
    queryKey: ["OfferMadeList", owner],
    queryFn: () => getOfferList({ from: owner, chainId }),
    staleTime: Infinity,
  });
  // const offerMadeList = result.data || [];

  const offerMadeList: IOfferItem[] =
    result.data?.map((offer) => {
      return cloneDeep({
        ...offer,
        status: offer.is_fulfilled
          ? "fulfilled"
          : offer.is_cancelled
          ? "cancelled"
          : offer.is_expired
          ? "expired"
          : "none",
      });
    }) || [];

  return { ...result, offerMadeList };
};

export default useOfferMadeList;
