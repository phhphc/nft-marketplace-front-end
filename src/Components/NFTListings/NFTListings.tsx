import { Accordion, AccordionTab } from "primereact/accordion";

export interface INFTListingsProps {}

const NFTListings = () => {
  return (
    <div id="nft-listings">
      <Accordion activeIndex={0}>
        <AccordionTab header="Listings"></AccordionTab>
      </Accordion>
    </div>
  );
};

export default NFTListings;