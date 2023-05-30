import { getNotificationByOwnerService } from "@Services/ApiService";
import { useQuery } from "react-query";

const useNotificationByOwner = (owner: string) => {
  const result = useQuery({
    queryKey: ["notification", owner],
    queryFn: () => getNotificationByOwnerService(owner),
    staleTime: Infinity,
  });
  const notification = result.data || [];
  return { ...result, notification };
};

export default useNotificationByOwner;
