import { CHAINID_CURRENCY } from "@Constants/index";
import { INFTActivity } from "@Interfaces/index";
import { AppContext } from "@Store/index";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Chart } from "primereact/chart";
import { useContext, useEffect, useState } from "react";

export interface INFTPredictPriceProps {
  nftListing: INFTActivity[];
  nftOffer: INFTActivity[];
}

const NFTPredictPrice = ({ nftListing, nftOffer }: INFTPredictPriceProps) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const web3Context = useContext(AppContext);

  useEffect(() => {
    let listingPrices = nftListing.map(
      (listing) => Number(listing.price) / 1000000000000000000
    );
    let offerPrices = nftOffer.map(
      (offer) => Number(offer.price) / 1000000000000000000
    );

    let listingData = listingPrices.map((price) => {
      return { x: 1, y: price };
    });

    let offerData = offerPrices.map((price) => {
      return { x: 1.5, y: price };
    });

    let predictData: any[] = [];
    if (listingPrices.length == 1 && offerPrices.length == 1) {
      if (listingPrices[0] === offerPrices[0]) {
        predictData.push({ x: 2, y: listingPrices[0] });
      }
    }
    if (listingPrices.length == 1 && offerPrices.length >= 2) {
      if (
        listingPrices[0] >= Math.min(...offerPrices) &&
        listingPrices[0] <= Math.max(...offerPrices)
      ) {
        predictData.push({ x: 2, y: listingPrices[0] });
      }
    }
    if (listingPrices.length >= 2 && offerPrices.length == 1) {
      if (
        offerPrices[0] >= Math.min(...listingPrices) &&
        offerPrices[0] <= Math.max(...listingPrices)
      ) {
        predictData.push({ x: 2, y: offerPrices[0] });
      }
    }
    if (listingData.length >= 2 && offerData.length >= 2) {
      if (
        Math.min(...listingPrices) >= Math.min(...offerPrices) &&
        Math.min(...listingPrices) <= Math.max(...offerPrices)
      ) {
        predictData.push({ x: 2, y: Math.min(...listingPrices) });
        predictData.push({ x: 2, y: Math.max(...offerPrices) });
      }
      if (
        Math.max(...listingPrices) >= Math.min(...offerPrices) &&
        Math.max(...listingPrices) <= Math.max(...offerPrices)
      ) {
        predictData.push({ x: 2, y: Math.max(...listingPrices) });
        predictData.push({ x: 2, y: Math.min(...offerPrices) });
      }
      if (
        Math.min(...listingPrices) <= Math.min(...offerPrices) &&
        Math.max(...listingPrices) >= Math.max(...offerPrices)
      ) {
        predictData.push({ x: 2, y: Math.max(...offerPrices) });
        predictData.push({ x: 2, y: Math.min(...offerPrices) });
      }
      if (
        Math.min(...listingPrices) >= Math.min(...offerPrices) &&
        Math.max(...listingPrices) <= Math.max(...offerPrices)
      ) {
        predictData.push({ x: 2, y: Math.max(...listingPrices) });
        predictData.push({ x: 2, y: Math.min(...listingPrices) });
      }
    }

    let datasets = [
      {
        label: "Listing",
        data: listingData,
        showLine: true,
        fill: false,
        borderColor: "green",
      },
      {
        label: "Offer",
        data: offerData,
        showLine: true,
        fill: false,
        borderColor: "blue",
      },
      {
        label: "Predict",
        data: predictData,
        showLine: true,
        fill: false,
        borderColor: "red",
      },
    ];

    const data = {
      datasets: datasets,
    };
    const options = {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          display: false,
          min: 0,
          max: 3,
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context: any) {
              let label = context.dataset.label || "";

              if (label && context.parsed.y !== null) {
                label +=
                  ": " +
                  context.parsed.y +
                  " " +
                  CHAINID_CURRENCY.get(web3Context.state.web3.chainId);
              }
              return label;
            },
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [nftListing, nftOffer]);

  return (
    <div id="nft-predict-price">
      <Accordion activeIndex={0}>
        <AccordionTab header="Predict Price">
          <Chart type="scatter" data={chartData} options={chartOptions} />
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default NFTPredictPrice;
