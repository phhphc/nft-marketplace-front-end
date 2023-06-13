import { OFFER_CURRENCY_UNITS } from "@Constants/index";
import { IOfferItem } from "@Interfaces/index";
import { cancelOrder } from "@Services/ApiService";
import { AppContext } from "@Store/index";
import { showingPrice } from "@Utils/index";
import moment from "moment";
import router from "next/router";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { MultiSelect } from "primereact/multiselect";
import { Tag } from "primereact/tag";
import { useContext, useEffect, useState } from "react";

export interface IOfferMadeListProps {
  offerMadeList: IOfferItem[];
  offerMadeListRefetch: () => void;
  nftRefetch: () => void;
  nftActivityRefetch: () => void;
}

const OfferMadeList = ({
  offerMadeList,
  offerMadeListRefetch,
  nftRefetch,
  nftActivityRefetch,
}: IOfferMadeListProps) => {
  const web3Context = useContext(AppContext);

  const [selectedStatus, setSelectedStatus] = useState(null);
  const [data, setData] = useState<IOfferItem[]>(offerMadeList);

  useEffect(() => {
    setData(offerMadeList);
  }, [offerMadeList]);

  const statuses: any[] = [
    { label: "Fulfilled", value: "fulfilled" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Expired", value: "expired" },
    { label: "None", value: "none" },
  ];

  const handleFilterStatus = (statuses: any) => {
    setSelectedStatus(statuses);
    statuses.length == 0
      ? setData(offerMadeList)
      : setData(
          offerMadeList.filter((offer) => statuses.includes(offer.status))
        );
  };

  const nameBodyTemplate = (rowData: IOfferItem) => {
    return (
      <div>
        <a
          style={{ cursor: "pointer" }}
          onClick={() => router.push(`/detail/${rowData.token_id}`)}
        >
          {rowData.nft_name || "Item name"}
        </a>
      </div>
    );
  };

  const offererBodyTemplate = (rowData: IOfferItem) => {
    return <div className="text-ellipsis overflow-hidden">You</div>;
  };

  const eventStatusBodyTemplate = (rowData: IOfferItem) => {
    if (rowData.is_fulfilled) {
      return (
        <Tag
          severity="success"
          value="Fulfilled"
          style={{ width: "4.3rem" }}
        ></Tag>
      );
    } else if (rowData.is_cancelled) {
      return <Tag severity="danger" value="Cancelled"></Tag>;
    } else if (rowData.is_expired) {
      return (
        <Tag
          severity="warning"
          value="Expired"
          style={{ width: "4.3rem" }}
        ></Tag>
      );
    }
    return null;
  };

  const imageBodyTemplate = (rowData: IOfferItem) => {
    return (
      <img
        src={
          rowData?.nft_image != "<nil>" && rowData?.nft_image != ""
            ? rowData?.nft_image
            : "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg?ver=6"
        }
        alt="item image"
        className="w-12 h-12 object-cover"
      />
    );
  };

  const nftDetailBodyTemplate = (rowData: IOfferItem) => {
    return (
      <i
        className="text-yellow-500 pi pi-book cursor-pointer hover:text-yellow-600"
        style={{ fontSize: "2rem" }}
        onClick={() => router.push(`/detail/${rowData.token_id}`)}
      ></i>
    );
  };

  const priceBodyTemplate = (rowData: IOfferItem): string => {
    return showingPrice(
      web3Context.state.web3.chainId,
      rowData?.price || "0",
      OFFER_CURRENCY_UNITS[0].value,
      true
    );
  };

  const endTimeBodyTemplate = (rowData: IOfferItem) => {
    return moment(new Date(Number(rowData?.end_time) * 1000)).format() ===
      "Invalid date"
      ? "None"
      : moment(new Date(Number(rowData?.end_time) * 1000)).format(
          "DD/MM/yyyy HH:mm"
        );
  };

  const cancelBodyTemplate = (rowData: IOfferItem) => {
    if (!rowData.is_cancelled && !rowData.is_expired && !rowData.is_fulfilled) {
      return (
        <i
          className="text-red-500 pi pi-times-circle pi-book cursor-pointer hover:text-red-700"
          style={{ fontSize: "2rem" }}
          onClick={() => handleCancelOrder(rowData)}
        ></i>
      );
    } else {
      return null;
    }
  };

  const handleCancelOrder = async (item: IOfferItem) => {
    try {
      if (!web3Context.state.web3.provider) {
        web3Context.state.web3.toast.current &&
          web3Context.state.web3.toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "Please login your wallet",
            life: 5000,
          });
        return;
      }
      if (item) {
        await cancelOrder({
          orderHashes: [item.order_hash],
          myWallet: web3Context.state.web3.myWallet,
          provider: web3Context.state.web3.provider,
          myAddress: web3Context.state.web3.myAddress,
          chainId: web3Context.state.web3.chainId,
        });
        web3Context.state.web3.toast.current &&
          web3Context.state.web3.toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Cancel offer successfully!",
            life: 5000,
          });
        offerMadeListRefetch();
        nftRefetch();
        nftActivityRefetch();
      }
    } catch (error) {
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to cancel offer!",
          life: 5000,
        });
    }
  };

  return (
    <div id="list-make-offer">
      <MultiSelect
        value={selectedStatus}
        onChange={(e) => handleFilterStatus(e.value)}
        options={statuses}
        showSelectAll={false}
        optionLabel="label"
        placeholder="Select Status"
        className="w-full md:w-20rem"
        appendTo="self"
        display="chip"
      />
      <DataTable
        value={data}
        scrollable
        scrollHeight="30rem"
        className="mt-5"
        stripedRows
      >
        <Column
          header="Offerer"
          className="w-20"
          body={offererBodyTemplate}
        ></Column>
        <Column header="Status" body={eventStatusBodyTemplate}></Column>
        <Column
          field="itemName"
          header="Name"
          className="text-ellipsis overflow-hidden name"
          body={nameBodyTemplate}
          sortable
        ></Column>
        <Column
          header="Image"
          body={imageBodyTemplate}
          className="image"
        ></Column>
        <Column
          field="price"
          header="Offered price"
          body={priceBodyTemplate}
          className="price"
          sortable
        ></Column>
        <Column header="End time" body={endTimeBodyTemplate}></Column>
        <Column header="Cancel" body={cancelBodyTemplate}></Column>
        <Column
          field=""
          header="View detail"
          body={nftDetailBodyTemplate}
        ></Column>
      </DataTable>
    </div>
  );
};

export default OfferMadeList;
