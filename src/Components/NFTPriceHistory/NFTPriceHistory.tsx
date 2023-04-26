import { Accordion, AccordionTab } from "primereact/accordion";

export interface INFTPriceHistoryProps {}

const NFTPriceHistory = () => {
  return (
    <div id="nft-price-history">
      <Accordion activeIndex={0}>
        <AccordionTab header="Price History"></AccordionTab>
      </Accordion>
    </div>
  );
};

export default NFTPriceHistory;
