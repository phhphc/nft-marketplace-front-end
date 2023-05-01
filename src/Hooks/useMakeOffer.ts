import { getMakeOfferList } from "@Services/ApiService";
import { useQuery } from "react-query";

const useMakeOffer = (owner: string) => {
  const result = useQuery({
    queryKey: ["MakeOffer", owner],
    queryFn: () => getMakeOfferList(owner),
    staleTime: Infinity,
  });
  const makeOfferList = result.data || [];
  return { ...result, makeOfferList };
};

export default useMakeOffer;
