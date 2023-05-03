import { INFTActivity } from "@Interfaces/index";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

export interface INFTOffersProps {}

const NFTOffers: INFTActivity[] = [
  
];

const NFTOffer = () => {
  return (
    <div id="nft-offers">
      <Accordion activeIndex={0}>
        <AccordionTab header="Offers">
          <DataTable
            value={NFTOffers}
            scrollable
            scrollHeight="20rem"
            className="mt-3"
          >
            <Column field="price" header="Price" />
            <Column field="quantity" header="Quantity" />
            <Column field="from" header="From" />
            <Column field="date" header="Date" />
          </DataTable>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default NFTOffer;
