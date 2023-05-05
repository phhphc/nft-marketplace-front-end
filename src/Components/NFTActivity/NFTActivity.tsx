import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useContext, useEffect, useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { INFTActivity, INFTEvent } from "@Interfaces/index";
import { showingPrice } from "@Utils/index";
import { CURRENCY_UNITS, NFT_EVENT_NAME } from "@Constants/index";
import { AppContext } from "@Store/index";
import moment from "moment";

export interface INFTActivityProps {
  nftActivity: INFTActivity[];
}

const NFTActivity = ({ nftActivity }: INFTActivityProps) => {
  const web3Context = useContext(AppContext);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [data, setData] = useState<INFTActivity[]>(nftActivity);
  const events: INFTEvent[] = [
    { label: "Sales", value: "sale" },
    { label: "Listings", value: "listing" },
    { label: "Offers", value: "offer" },
    { label: "Transfers", value: "transfer" },
  ];

  useEffect(() => {
    setData(nftActivity);
  }, [nftActivity]);

  const handleFilterEvent = (events: any) => {
    setSelectedEvent(events);
    events.length == 0
      ? setData(nftActivity)
      : setData(
          nftActivity.filter((nft: INFTActivity) => events.includes(nft.name))
        );
  };

  const eventNameBodyTemplate = (rowData: INFTActivity) => {
    return rowData.name.toLowerCase() ===
      NFT_EVENT_NAME.TRANSFER.toLowerCase() && rowData.from.includes("0x00")
      ? rowData.name.charAt(0).toUpperCase() +
          rowData.name.slice(1) +
          " (" +
          NFT_EVENT_NAME.MINTED +
          ")"
      : rowData.name.charAt(0).toUpperCase() + rowData.name.slice(1);
  };
  const priceBodyTemplate = (rowData: INFTActivity): string => {
    return rowData.price
      ? showingPrice(rowData?.price || "0", CURRENCY_UNITS[0].value, true)
      : "";
  };
  const fromBodyTemplate = (rowData: INFTActivity) => {
    return (
      <div className="text-ellipsis overflow-hidden">
        {web3Context.state.web3.myAddress === rowData.from
          ? "You"
          : rowData.from}
      </div>
    );
  };
  const toBodyTemplate = (rowData: INFTActivity) => {
    return (
      <div className="text-ellipsis overflow-hidden">
        {web3Context.state.web3.myAddress === rowData.to ? "You" : rowData.to}
      </div>
    );
  };
  const timeBodyTemplate = (rowData: INFTActivity) => {
    return moment(rowData.date).startOf("minute").fromNow();
  };
  const viewingEtherscanBodyTemplate = (rowData: INFTActivity) => {
    return rowData.link ? (
      <a href={rowData.link} target="_blank">
        <i
          className="text-yellow-500 pi pi-window-maximize cursor-pointer hover:text-yellow-600"
          style={{ fontSize: "2rem" }}
        ></i>
      </a>
    ) : (
      ""
    );
  };

  return (
    <div id="nft-activity">
      <MultiSelect
        value={selectedEvent}
        onChange={(e) => handleFilterEvent(e.value)}
        options={events}
        showSelectAll={false}
        optionLabel="label"
        placeholder="Select Event"
        className="w-full md:w-20rem"
        appendTo="self"
        display="chip"
      />
      <DataTable
        value={data}
        scrollable
        scrollHeight="20rem"
        className="mt-5"
        stripedRows
      >
        <Column
          field="name"
          header="Event"
          body={eventNameBodyTemplate}
          sortable
        ></Column>
        <Column
          field="price"
          header="Price"
          body={priceBodyTemplate}
          sortable
        ></Column>
        <Column field="quantity" header="Quantity" sortable></Column>
        <Column field="type" header="Type" sortable></Column>
        <Column header="From" className="w-20" body={fromBodyTemplate}></Column>
        <Column header="To" className="w-20" body={toBodyTemplate}></Column>
        <Column
          field="date"
          header="Time"
          body={timeBodyTemplate}
          sortable
        ></Column>
        <Column
          field="link"
          header="View on Etherscan"
          body={viewingEtherscanBodyTemplate}
        ></Column>
      </DataTable>
    </div>
  );
};

export default NFTActivity;
