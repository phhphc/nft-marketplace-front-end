import { OFFER_CURRENCY_UNITS } from "@Constants/index";
import { IMakeOfferItem } from "@Interfaces/index";
import { fulfillMakeOffer } from "@Services/ApiService";
import { AppContext } from "@Store/index";
import { showingPrice } from "@Utils/index";
import router from "next/router";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useContext } from "react";

export interface IOfferReceivedListProps {
  offerReceivedList: IMakeOfferItem[];
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

  const data = offerReceivedList.map((item: IMakeOfferItem) => {
    return {
      offererAddress: item.offerer,
      orderHash: item.orderHash,
      itemName: item.itemName,
      itemImage: item.itemImage,
      identifier: item.consideration[0].identifier,
      price: item.offer[0].startAmount,
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
      <div className="text-ellipsis overflow-hidden">
        {rowData.offererAddress}
      </div>
    );
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

  const fulfillBodyTemplate = (rowData: IMakeOfferItem) => {
    return (
      <i
        className="text-green-500 pi pi-check-circle cursor-pointer hover:text-green-700"
        style={{ fontSize: "2rem" }}
        onClick={() => handleFulfillOrder(rowData)}
      ></i>
    );
  };

  const rejectBodyTemplate = (rowData: IMakeOfferItem) => {
    return (
      <i
        className="text-red-500 pi pi-times-circle pi-book cursor-pointer hover:text-red-700"
        style={{ fontSize: "2rem" }}
        onClick={() => rejectFulfillOrder(rowData)}
      ></i>
    );
  };

  const handleFulfillOrder = async (item: IMakeOfferItem) => {
    try {
      await fulfillMakeOffer({
        orderHash: item.orderHash,
        price: item.price,
        myWallet: web3Context.state.web3.myWallet,
        provider: web3Context.state.web3.provider,
        myAddress: web3Context.state.web3.myAddress,
      });
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Approve offer successfully!",
          life: 5000,
        });
      offerReceivedListRefetch();
      nftRefetch();
      nftActivityRefetch();
    } catch (error) {
      web3Context.state.web3.toast.current &&
        web3Context.state.web3.toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Fail to approve offer!",
          life: 5000,
        });
    }
  };

  const rejectFulfillOrder = async (item: IMakeOfferItem) => {};

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
        <Column
          field="fulfill"
          header="Approve"
          body={fulfillBodyTemplate}
        ></Column>
        {/* <Column
          field="reject"
          header="Reject"
          body={rejectBodyTemplate}
        ></Column> */}
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
