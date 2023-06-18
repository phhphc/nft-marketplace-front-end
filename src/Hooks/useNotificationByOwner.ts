import { getNotificationByOwnerService } from "@Services/ApiService";
import { useQuery } from "react-query";

const useNotificationByOwner = (
  owner: string,
  chainId: number,
  authToken: string
) => {
  const result = useQuery({
    queryKey: ["notification", owner],
    queryFn: () => getNotificationByOwnerService(owner, chainId, authToken),
    staleTime: Infinity,
  });
  const notification = result.data || [];
  return { ...result, notification };
};

export default useNotificationByOwner;
