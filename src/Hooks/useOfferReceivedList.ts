import { getOfferList } from "@Services/ApiService";
import { useQuery } from "react-query";

const useOfferReceivedList = (owner: string) => {
  const result = useQuery({
    queryKey: ["OfferReceivedList", owner],
    queryFn: () => getOfferList({owner: owner}),
    staleTime: Infinity,
  });
  const offerReceivedList = result.data || [];
  return { ...result, offerReceivedList };
};

export default useOfferReceivedList;
