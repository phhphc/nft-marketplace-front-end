import { CURRENCY_UNITS } from "@Constants/index";
import { INFTActivity } from "@Interfaces/index";
import { AppContext } from "@Store/index";
import { showingPrice } from "@Utils/index";
import moment from "moment";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { useContext } from "react";

export interface INFTListingsProps {
  nftListing: INFTActivity[];
}

const NFTListing = ({ nftListing }: INFTListingsProps) => {
  const web3Context = useContext(AppContext);
  const priceBodyTemplate = (rowData: INFTActivity): string => {
    return showingPrice(rowData?.price || "0", CURRENCY_UNITS[0].value, true);
  };
  const fromBodyTemplate = (rowData: INFTActivity) => {
    return (
      <div className="text-ellipsis overflow-hidden w-48">
        {web3Context.state.web3.myAddress === rowData.from
          ? "You"
          : rowData.from}
      </div>
    );
  };
  const eventStatusBodyTemplate = (rowData: INFTActivity) => {
    if (rowData.is_cancelled) {
      return <Tag severity="danger" value="Cancelled"></Tag>;
    } else if (rowData.is_fulfilled) {
      return (
        <Tag severity="success" value="Sold" style={{ width: "4rem" }}></Tag>
      );
    }
    return "";
  };

  const timeBodyTemplate = (rowData: INFTActivity) => {
    return moment(rowData.date).startOf("minute").fromNow();
  };

  return (
    <div id="nft-listings">
      <Accordion activeIndex={0}>
        <AccordionTab header="Listings">
          <DataTable
            value={nftListing}
            scrollable
            scrollHeight="20rem"
            className="mt-3"
          >
            <Column header="Status" body={eventStatusBodyTemplate}></Column>
            <Column
              field="price"
              header="Price"
              body={priceBodyTemplate}
              sortable
            />
            <Column
              field="from"
              header="From"
              className="w-20"
              body={fromBodyTemplate}
            />
            <Column
              field="date"
              header="Time"
              body={timeBodyTemplate}
              sortable
            />
          </DataTable>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default NFTListing;
