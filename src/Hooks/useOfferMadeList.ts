import { getOfferMadeList } from "@Services/ApiService";
import { useQuery } from "react-query";

const useOfferMadeList = (owner: string) => {
  const result = useQuery({
    queryKey: ["OfferMadeList", owner],
    queryFn: () => getOfferMadeList(owner),
    staleTime: Infinity,
  });
  const offerMadeList = result.data || [];
  return { ...result, offerMadeList };
};

export default useOfferMadeList;
