import { CHAINID_CURRENCY } from "@Constants/index";
import { INFTActivity } from "@Interfaces/index";
import { AppContext } from "@Store/index";
import { showingPrice } from "@Utils/index";
import moment from "moment";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Chart } from "primereact/chart";
import { useContext, useEffect, useState } from "react";

export interface INFTPriceHistoryProps {
  nftSale: INFTActivity[];
}

const NFTPriceHistory = ({ nftSale }: INFTPriceHistoryProps) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const web3Context = useContext(AppContext);

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const data = {
      labels: nftSale.map((nft) =>
        moment(nft.date).format("DD/MM/yyyy - h:mm A")
      ),
      datasets: [
        {
          label: "NFT price",
          data: nftSale.map((nft) => Number(nft.price) / 1000000000000000000),
          fill: false,
          borderColor: documentStyle.getPropertyValue("--blue-500"),
          tension: 0.4,
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 1,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
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
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
            stepSize: 0.5,
          },
          grid: {
            color: surfaceBorder,
          },
          title: {
            display: true,
            text: CHAINID_CURRENCY.get(web3Context.state.web3.chainId),
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [nftSale]);

  return (
    <div id="nft-price-history">
      <Accordion activeIndex={0}>
        <AccordionTab header="Price History">
          <Chart type="line" data={chartData} options={chartOptions} />
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default NFTPriceHistory;
