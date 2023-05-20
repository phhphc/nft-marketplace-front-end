import { OFFER_CURRENCY_UNITS } from "@Constants/index";
import { IMakeOfferItem, IOfferItem } from "@Interfaces/index";
import { cancelOrder } from "@Services/ApiService";
import { AppContext } from "@Store/index";
import { showingPrice } from "@Utils/index";
import moment from "moment";
import router from "next/router";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useContext, useMemo } from "react";

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

  const data = offerMadeList.map((item: IOfferItem) => {
    return {
      offererAddress: item.from,
      orderHash: item.order_hash,
      itemName: item.nft_name,
      itemImage: item.nft_image,
      identifier: item.token_id,
      price: item.price,
      endTime: item.end_time,
    };
  });

  const nameBodyTemplate = (rowData: IMakeOfferItem) => {
    return (
      <div>
        <a
          style={{ cursor: "pointer" }}
          onClick={() => router.push(`/detail/${rowData.identifier}`)}
        >
          {rowData.itemName || "Item name"}
        </a>
      </div>
    );
  };

  const offererBodyTemplate = (rowData: IMakeOfferItem) => {
    return <div className="text-ellipsis overflow-hidden">You</div>;
  };

  const imageBodyTemplate = (rowData: IMakeOfferItem) => {
    return (
      <img
        src={
          rowData?.itemImage != "<nil>" && rowData?.itemImage != ""
            ? rowData?.itemImage
            : "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg?ver=6"
        }
        alt="item image"
        className="w-12 h-12 object-cover"
      />
    );
  };

  const nftDetailBodyTemplate = (rowData: IMakeOfferItem) => {
    return (
      <i
        className="text-yellow-500 pi pi-book cursor-pointer hover:text-yellow-600"
        style={{ fontSize: "2rem" }}
        onClick={() => router.push(`/detail/${rowData.identifier}`)}
      ></i>
    );
  };

  const priceBodyTemplate = (rowData: IMakeOfferItem): string => {
    return showingPrice(
      rowData?.price || "0",
      OFFER_CURRENCY_UNITS[0].value,
      true
    );
  };

  const endTimeBodyTemplate = (rowData: IMakeOfferItem) => {
    return moment(new Date(Number(rowData?.endTime) * 1000)).format(
      "DD/MM/yyyy HH:mm"
    );
  };

  const cancelBodyTemplate = (rowData: IMakeOfferItem) => {
    return (
      <i
        className="text-red-500 pi pi-times-circle pi-book cursor-pointer hover:text-red-700"
        style={{ fontSize: "2rem" }}
        onClick={() => handleCancelOrder(rowData)}
      ></i>
    );
  };

  const handleCancelOrder = async (item: IMakeOfferItem) => {
    try {
      if (item) {
        await cancelOrder({
          orderHashes: [item.orderHash],
          myWallet: web3Context.state.web3.myWallet,
          provider: web3Context.state.web3.provider,
          myAddress: web3Context.state.web3.myAddress,
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
      <DataTable value={data} scrollable scrollHeight="20rem" stripedRows>
        <Column
          header="Offerer"
          className="w-20"
          body={offererBodyTemplate}
        ></Column>
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
