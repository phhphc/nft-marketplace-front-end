import { INFTCollectionItem } from "@Interfaces/index";
import { showingPrice } from "@Utils/index";
import router from "next/router";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { useState } from "react";

const MakeOfferList = () => {
  const products = [
    {
      maker_address: "f230fh0g3",
      order_hash: "f230fh0g3",
      name: "Bamboo Watch",
      identifier: "2200021",
      image: "",
      offered_price: 65,
      ERC20_quantity: 2,
    },
  ];

  const nameBodyTemplate = (rowData: INFTCollectionItem[]) => {
    return (
      <div>
        <a
          style={{ cursor: "pointer" }}
          onClick={() => router.push(`/detail/${rowData[0].identifier}`)}
        >
          {rowData.length == 1
            ? rowData[0].name || "Item name"
            : rowData.map((item) => <div>{item.name || "Item name"}</div>)}
        </a>
      </div>
    );
  };

  const imageBodyTemplate = (rowData: INFTCollectionItem[]) => {
    return (
      <img
        src={
          rowData[0]?.image != "<nil>" && rowData[0]?.image != ""
            ? rowData[0]?.image
            : "https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101028/112815904-no-image-available-icon-flat-vector-illustration.jpg?ver=6"
        }
        alt="item image"
        className="product-image"
      />
    );
  };

  const priceBodyTemplate = (rowData: INFTCollectionItem[]): string => {
    return rowData.length == 1
      ? showingPrice(rowData[0]?.listings[0]?.start_price || "0")
      : showingPrice(
          String(
            Number(rowData[0].listings[0]?.start_price || 0) * rowData.length
          )
        );
    // return showingPrice(rowData[0]?.listings[0]?.start_price || "0");
  };

  const fulfillBodyTemplate = (rowData: INFTCollectionItem[]) => {
    return (
      <i
        className="text-green-500 pi pi-check-circle cursor-pointer"
        onClick={handleFulfillOrder}
      ></i>
    );
  };

  const rejectBodyTemplate = (rowData: INFTCollectionItem[]) => {
    return <i className="text-red-500 pi pi-times-circle cursor-pointer" onClick={rejectFulfillOrder}></i>;
  };

  const handleFulfillOrder = () => {};

  const rejectFulfillOrder = () => {};

  return (
    <div id="list-make-offer">
      <Accordion activeIndex={0} className="mt-6">
        <AccordionTab header=" List of NFTs are offered">
          <DataTable value={products}>
            <Column field="maker_address" header="Maker's address"></Column>
            <Column field="order_hash" header="Order hash"></Column>
            <Column field="name" header="Name"></Column>
            <Column field="identifier" header="Identifier"></Column>
            <Column header="Image" body={imageBodyTemplate}></Column>
            <Column field="offered_price" header="Offered price"></Column>
            <Column field="ERC20_quantity" header="ERC20 quantity"></Column>
            <Column
              field="fulfill"
              header="Fulfill"
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
