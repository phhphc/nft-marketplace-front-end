import { CURRENCY_UNITS } from "@Constants/index";
import { INFTActivity } from "@Interfaces/index";
import { AppContext } from "@Store/index";
import { showingPrice } from "@Utils/index";
import moment from "moment";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useContext } from "react";

export interface INFTOffersProps {
  nftOffer: INFTActivity[];
}

const NFTOffer = ({ nftOffer }: INFTOffersProps) => {
  const web3Context = useContext(AppContext);
  const priceBodyTemplate = (rowData: INFTActivity): string => {
    return showingPrice(rowData?.price || "0", CURRENCY_UNITS[0].value, true);
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
  const timeBodyTemplate = (rowData: INFTActivity) => {
    return moment(rowData.date).startOf("minute").fromNow();
  };

  return (
    <div id="nft-offers">
      <Accordion activeIndex={0}>
        <AccordionTab header="Offers">
          <DataTable
            value={nftOffer}
            scrollable
            scrollHeight="20rem"
            className="mt-3"
          >
            <Column field="price" header="Price" body={priceBodyTemplate} sortable />
            <Column field="quantity" header="Quantity" sortable />
            <Column
              field="from"
              header="From"
              className="w-20"
              body={fromBodyTemplate}
            />
            <Column
              field="date"
              header="Date"
              body={timeBodyTemplate}
              sortable
            />
          </DataTable>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default NFTOffer;
