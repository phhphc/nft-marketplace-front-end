import { Accordion, AccordionTab } from "primereact/accordion";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";
import { MultiSelect } from "primereact/multiselect";
import { INFTActivity, INFTEvent } from "@Interfaces/index";

export interface INFTActivityProps {}

const NFTActivites: INFTActivity[] = [
  
];

const NFTActivity = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const events: INFTEvent[] = [
    { label: "Sales", value: "sales" },
    { label: "Listings", value: "listings" },
    { label: "Offers", value: "offers" },
    { label: "Transfers", value: "transfers" },
  ];

  return (
    <div id="nft-activity">
      <Accordion activeIndex={0}>
        <AccordionTab header="Item Activity">
          <MultiSelect
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.value)}
            options={events}
            showSelectAll={false}
            optionLabel="label"
            placeholder="Select Event"
            className="w-full md:w-20rem"
            appendTo="self"
            display="chip"
          />
          <DataTable
            value={NFTActivites}
            scrollable
            scrollHeight="20rem"
            className="mt-5"
          >
            <Column field="name" header="Event" />
            <Column field="price" header="Price" />
            <Column field="quantity" header="Quantity" />
            <Column field="from" header="From" />
            <Column field="to" header="To" />
            <Column field="date" header="Date" />
            <Column field="link" header="View on Etherscan" />
          </DataTable>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default NFTActivity;
