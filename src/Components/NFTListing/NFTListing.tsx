import { INFTListings } from "@Interfaces/index";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export interface INFTListingsProps {}

const NFTListings: INFTListings[] = [
  {
    price: "0.045 ETH",
    quantity: "1",
    expiration: "in 24 hours",
    from: "0xc45",
  },
];

const NFTListing = () => {
  
  return (
    <div id="nft-listings">
      <Accordion activeIndex={0}>
        <AccordionTab header="Listings">
          <DataTable
            value={NFTListings}
            scrollable
            scrollHeight="20rem"
            className="mt-3"
          >
            <Column field="price" header="Price" />
            <Column field="quantity" header="Quantity" />
            <Column field="expiration" header="Expiration" />
            <Column field="from" header="From" />
          </DataTable>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default NFTListing;
