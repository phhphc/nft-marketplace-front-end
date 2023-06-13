import { getNotificationByOwnerService } from "@Services/ApiService";
import { useQuery } from "react-query";

const useNotificationByOwner = (
  owner: string,
  chainId: number
) => {
  const result = useQuery({
    queryKey: ["notification", owner],
    queryFn: () => getNotificationByOwnerService(owner, chainId),
    staleTime: Infinity,
  });
  const notification = result.data || [];
  return { ...result, notification };
};

export default useNotificationByOwner;
