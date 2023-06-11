import { OFFER_CURRENCY_UNITS } from "@Constants/index";
import { IMakeOfferItem, IOfferItem } from "@Interfaces/index";
import { fulfillMakeOffer } from "@Services/ApiService";
import { AppContext, WEB3_ACTION_TYPES } from "@Store/index";
import { showingPrice } from "@Utils/index";
import moment from "moment";
import router from "next/router";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { useContext, useMemo } from "react";

export interface IOfferReceivedListProps {
  offerReceivedList: IOfferItem[];
  offerReceivedListRefetch: () => void;
  nftRefetch: () => void;
  nftActivityRefetch: () => void;
}

const OfferReceivedList = ({
  offerReceivedList,
  offerReceivedListRefetch,
  nftRefetch,
  nftActivityRefetch,
}: IOfferReceivedListProps) => {
  const web3Context = useContext(AppContext);

  const data = offerReceivedList.map((item: IOfferItem) => {
    return {
      owner: item.owner,
      offererAddress: item.from,
      orderHash: item.order_hash,
      itemName: item.nft_name,
      itemImage: item.nft_image,
      identifier: item.token_id,
      price: item.price,
      endTime: item.end_time,
      isFulfilled: item.is_fulfilled,
      isCancelled: item.is_cancelled,
      isExpired: item.is_expired,
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
    return (
      <div className="text-ellipsis overflow-hidden w-48">
        {rowData.offererAddress}
      </div>
    );
  };

  const eventStatusBodyTemplate = (rowData: IMakeOfferItem) => {
    if (rowData.isFulfilled) {
      return (
        <Tag
          severity="success"
          value="Fulfilled"
          style={{ width: "4.3rem" }}
        ></Tag>
      );
    } else if (rowData.isCancelled) {
      return <Tag severity="danger" value="Cancelled"></Tag>;
    } else if (rowData.isExpired) {
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
    return moment(new Date(Number(rowData?.endTime) * 1000)).format() ===
      "Invalid date"
      ? "None"
      : moment(new Date(Number(rowData?.endTime) * 1000)).format(
          "DD/MM/yyyy HH:mm"
        );
  };

  const fulfillBodyTemplate = (rowData: IMakeOfferItem) => {
    if (!rowData.isCancelled && !rowData.isExpired && !rowData.isFulfilled && rowData.owner===web3Context.state.web3.myAddress) {
      return (
        <i
          className="text-green-500 pi pi-check-circle cursor-pointer hover:text-green-700"
          style={{ fontSize: "2rem" }}
          onClick={() => handleFulfillOrder(rowData)}
        ></i>
      );
    }
    else {
      return null
    }
  };

  const handleFulfillOrder = async (item: IMakeOfferItem) => {
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
      await fulfillMakeOffer({
        orderHash: item.orderHash,
        price: item.price,
        myWallet: web3Context.state.web3.myWallet,
        provider: web3Context.state.web3.provider,
        myAddress: web3Context.state.web3.myAddress,
        beforeApprove: () => {
          web3Context.dispatch({ type: WEB3_ACTION_TYPES.ADD_LOADING });
        },
        afterApprove: () => {
          web3Context.dispatch({ type: WEB3_ACTION_TYPES.REMOVE_LOADING });
        },
      });
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Fulfill offer successfully!",
          life: 5000,
        });
      offerReceivedListRefetch();
      nftRefetch();
      nftActivityRefetch();
    } catch (error) {
      web3Context.dispatch({ type: WEB3_ACTION_TYPES.REMOVE_LOADING });
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to fulfill offer!",
          life: 5000,
        });
    }
  };

  return (
    <div id="list-make-offer">
      <DataTable value={data} scrollable scrollHeight="30rem" stripedRows>
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
        <Column
          field="fulfill"
          header="Fulfill"
          body={fulfillBodyTemplate}
        ></Column>
        <Column
          field=""
          header="View detail"
          body={nftDetailBodyTemplate}
        ></Column>
      </DataTable>
    </div>
  );
};

export default OfferReceivedList;
