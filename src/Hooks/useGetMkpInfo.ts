import { getMkpInfo } from "@Services/ApiService";
import { useQuery } from "react-query";

const useGetMkpInfo = (chainId: number) => {
  const result = useQuery({
    queryKey: ["mkpInfo", chainId],
    queryFn: () => getMkpInfo({ chainId }),
    staleTime: Infinity,
  });
  const mkpInfo = result.data || [];
  return { ...result, mkpInfo };
};

export default useGetMkpInfo;
