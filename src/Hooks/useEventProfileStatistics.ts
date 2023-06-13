import { getSaleEventByAddrMthYrService } from "@Services/ApiService";
import { useQuery } from "react-query";

interface IUseSaleEventByAddrMthYrProps {
  address: string;
  month: number;
  year: number;
}

const useSaleEventByAddrMthYr = ({
  address,
  month,
  year,
}: IUseSaleEventByAddrMthYrProps) => {
  const result = useQuery({
    queryKey: `saleEventListByAddress-${address}-${year}-${month}`,
    queryFn: () => getSaleEventByAddrMthYrService({ month, year, address }),
    staleTime: Infinity,
  });
  const nftSaleByMth = result.data || [];
  return { ...result, nftSaleByMth };
};

export default useSaleEventByAddrMthYr;
