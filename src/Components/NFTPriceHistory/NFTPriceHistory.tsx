import { Accordion, AccordionTab } from "primereact/accordion";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";

export interface INFTPriceHistoryProps {}

const NFTPriceHistory = () => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue(
      "--text-color-secondary"
    );
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");
    const data = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "NFT price",
          data: [1, 2, 3],
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
            text: "ETH",
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, []);

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
