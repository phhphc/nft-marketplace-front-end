import { getEventNFTService } from "@Services/ApiService";
import { useQuery } from "react-query";

interface IUseNFTActivityProps {
  token?: string;
  token_id?: string;
  name?: string;
}

const useNFTActivity = ({ token, token_id, name }: IUseNFTActivityProps) => {
  const result = useQuery({
    queryKey: `nftActivity-${token}-${token_id}-${name}`,
    queryFn: () => getEventNFTService({ token, token_id, name }),
    staleTime: Infinity,
  });
  const nftActivity = result.data || [];
  return { ...result, nftActivity };
};

export default useNFTActivity;
