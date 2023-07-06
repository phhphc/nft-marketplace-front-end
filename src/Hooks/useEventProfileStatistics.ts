import { getSaleEventByAddrMthYrService } from "@Services/ApiService";
import { useQuery } from "react-query";

interface IUseSaleEventByAddrMthYrProps {
  address: string;
  startDate: string;
  endDate: string;
  chainId: number;
}

const useSaleEventByAddrMthYr = ({
  address,
  startDate,
  endDate,
  chainId
}: IUseSaleEventByAddrMthYrProps) => {
  const result = useQuery({
    queryKey: `saleEventListByAddress-${address}-${startDate}-${endDate}`,
    queryFn: () => getSaleEventByAddrMthYrService({ startDate, endDate, address, chainId }),
    staleTime: Infinity,
  });
  const nftSaleByMth = result.data || [];
  return { ...result, nftSaleByMth };
};

export default useSaleEventByAddrMthYr;
