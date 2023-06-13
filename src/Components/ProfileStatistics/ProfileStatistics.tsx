import { INFTActivity } from "@Interfaces/index";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "@Store/index";
import moment from "moment";

interface IStatisticPerDay {
  count: number;
  avgPrice: number;
}

interface IProfileStatisticsProps {
  nftSaleByMonth: INFTActivity[];
  refetch: () => void;
  month: number;
  year: number;
  handleChangeMonth: (cmd: string) => void;
}

const ProfileStatistics = ({
  nftSaleByMonth,
  month,
  year,
  handleChangeMonth,
}: IProfileStatisticsProps) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const web3Context = useContext(AppContext);
  const monthName = moment(new Date().setMonth(month - 1)).format("MMMM");

  // process saleEvent to statistic revenue and expenditure per day
  const revenuePerDay: Array<IStatisticPerDay> = [];
  const expenditurePerDay: Array<IStatisticPerDay> = [];

  const dayList = Array.from(
    new Set(nftSaleByMonth.map((event) => new Date(event.date).getDate()))
  );

  const revenueList = nftSaleByMonth.filter(
    (event) => event.from === web3Context.state.web3.myAddress
  );

  const expenditureList = nftSaleByMonth.filter(
    (event) => event.to === web3Context.state.web3.myAddress
  );

  dayList.forEach((day) => {
    // revenue per day
    let revenueCount = 0;
    let revenueAvgPrice = 0;

    let revenueThisDay = revenueList.filter(
      (revenue) => new Date(revenue.date).getDate() === day
    );

    revenueThisDay.forEach((revenue) => {
      if (revenue.type === "single") {
        revenueCount += 1;
        revenueAvgPrice += Number(revenue.price);
      } else {
        revenueCount += 1 / 2;
        revenueAvgPrice += Number(revenue.price) / 2;
      }
    });

    revenuePerDay.push({
      count: revenueCount,
      avgPrice: revenueAvgPrice,
    });

    // expenditure per day
    let expenditureCount = 0;
    let expenditureAvgPrice = 0;

    let expenditureThisDay = expenditureList.filter(
      (expenditure) => new Date(expenditure.date).getDate() === day
    );

    expenditureThisDay.forEach((expenditure) => {
      if (expenditure.type === "single") {
        expenditureCount += 1;
        expenditureAvgPrice += Number(expenditure.price);
      } else {
        expenditureCount += 1 / 2;
        expenditureAvgPrice += Number(expenditure.price) / 2;
      }
    });

    expenditurePerDay.push({
      count: expenditureCount,
      avgPrice: expenditureAvgPrice,
    });
  });

  useEffect(() => {
    const data = {
      labels: dayList.map((day) => "Day " + day),
      datasets: [
        {
          label: "Revenue",
          backgroundColor: "green",
          data: revenuePerDay.map(
            (revenue) => revenue.avgPrice / 1000000000000000000
          ),
        },
        {
          label: "Expenditure",
          backgroundColor: "blue",
          data: expenditurePerDay.map(
            (expenditure) => expenditure.avgPrice / 1000000000000000000
          ),
        },
      ],
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 1,
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: `Revenue and Expenditure Statistics in ${monthName}, ${year} `,
          font: {
            size: 16,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              let label = context.dataset.label || "";
              let index = context.parsed.x;
              let avgPrice = context.parsed.y;
              let count = 0;

              if (label === "Revenue") {
                count = revenuePerDay[index].count;
              } else if (label === "Expenditure") {
                count = expenditurePerDay[index].count;
              } else {
              }

              return [
                label,
                "Avg. price: " + avgPrice + " ETH",
                "Num. times: " + count,
              ];
            },
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [nftSaleByMonth]);

  return (
    <div id="nft-predict-price" className="w-full h-full">
      <div className="flex justify-around items-center">
        <button
          className="cursor-pointer hover:text-blue-600"
          onClick={() => handleChangeMonth("prev")}
        >
          <i className="pi pi-chevron-left" style={{ fontSize: "2rem" }}></i>
        </button>
        <Chart
          className="w-5/6"
          type="bar"
          data={chartData}
          options={chartOptions}
          style={{ height: "400px" }}
        />
        <button
          className="cursor-pointer hover:text-blue-600"
          onClick={() => handleChangeMonth("next")}
        >
          <i className="pi pi-chevron-right" style={{ fontSize: "2rem" }}></i>
        </button>
      </div>
    </div>
  );
};

export default ProfileStatistics;
