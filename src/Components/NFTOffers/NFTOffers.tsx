import { Accordion, AccordionTab } from "primereact/accordion";

export interface INFTOffersProps {}

const NFTOffers = () => {
  return (
    <div id="nft-offers">
      <Accordion activeIndex={0}>
        <AccordionTab header="Offers"></AccordionTab>
      </Accordion>
    </div>
  );
};

export default NFTOffers;