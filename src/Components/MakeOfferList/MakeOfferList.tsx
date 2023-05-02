import { OFFER_CURRENCY_UNITS } from "@Constants/index";
import { IMakeOfferItem, INFTCollectionItem } from "@Interfaces/index";
import { fulfillMakeOffer } from "@Services/ApiService";
import { AppContext } from "@Store/index";
import { showingPrice } from "@Utils/index";
import router from "next/router";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useContext, useState } from "react";

export interface IMakeOfferListProps {
  makeOfferList: IMakeOfferItem[];
  makeOfferRefetch: () => void;
  nftRefetch: () => void;
}

const MakeOfferList = ({
  makeOfferList,
  makeOfferRefetch,
  nftRefetch,
}: IMakeOfferListProps) => {
  const web3Context = useContext(AppContext);

  const data = makeOfferList.map((item: IMakeOfferItem) => {
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
        className="text-green-500 pi pi-check-circle cursor-pointer hover:text-green-600"
        style={{ fontSize: "2rem" }}
        onClick={() => handleFulfillOrder(rowData)}
      ></i>
    );
  };

  const rejectBodyTemplate = (rowData: IMakeOfferItem) => {
    return (
      <i
        className="text-red-500 pi pi-times-circle cursor-pointer hover:text-red-600"
        style={{ fontSize: "2rem" }}
        onClick={() => rejectFulfillOrder(rowData)}
      ></i>
    );
  };

  const handleFulfillOrder = async (item: IMakeOfferItem) => {
    await fulfillMakeOffer({
      orderHash: item.orderHash,
      price: item.price,
      myWallet: web3Context.state.web3.myWallet,
      provider: web3Context.state.web3.provider,
      myAddress: web3Context.state.web3.myAddress,
    });
    makeOfferRefetch();
    nftRefetch();
  };

  const rejectFulfillOrder = (item: IMakeOfferItem) => {};

  return (
    <div id="list-make-offer">
      <Accordion activeIndex={0} className="mt-6">
        <AccordionTab header=" List of NFTs are offered">
          <DataTable
            value={data}
            scrollHeight="20rem"
            stripedRows
            tableStyle={{ width: "50rem" }}
          >
            <Column
              field="offererAddress"
              header="Offerer"
              className="text-ellipsis overflow-hidden offerer"
            ></Column>
            <Column
              field="itemName"
              header="Name"
              className="text-ellipsis overflow-hidden name"
              body={nameBodyTemplate}
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
            ></Column>
            <Column
              field="fulfill"
              header="Approve"
              body={fulfillBodyTemplate}
            ></Column>
            <Column
              field="reject"
              header="Reject"
              body={rejectBodyTemplate}
            ></Column>
          </DataTable>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default MakeOfferList;
