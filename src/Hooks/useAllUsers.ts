import { getAllUsers } from "@Services/ApiService";
import { useQuery } from "react-query";

const useAllUsers = (chainId: number) => {
  const result = useQuery({
    queryKey: ["allUsers", chainId],
    queryFn: () => getAllUsers({ chainId }),
    staleTime: Infinity,
  });
  const users = result.data || [];
  return { ...result, users };
};

export default useAllUsers;
