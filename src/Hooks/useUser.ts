import { getUser } from "@Services/ApiService";
import { useQuery } from "react-query";

const useUser = (address: string, chainId: number) => {
  const result = useQuery({
    queryKey: ["User", address, chainId],
    queryFn: () => getUser({ address, chainId }),
  });
  const user = result.data || null;
  return { ...result, user };
};

export default useUser;
