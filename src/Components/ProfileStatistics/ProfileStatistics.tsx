import { INFTActivity } from "@Interfaces/index";
import { Chart } from "primereact/chart";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { AppContext } from "@Store/index";
import { CHAIN_ID } from "@Constants/index";
import { IStatisticsInterval } from "@Components/UserProfileTabs/UserProfileTabs";
import { CHANGE_STATISTICS_CMD } from "@Containers/UserProfileContainer/constant";
import { Calendar } from "primereact/calendar";

interface IStatisticPerDay {
  count: number;
  avgPrice: number;
}

interface IProfileStatisticsProps {
  nftSaleByMonth: INFTActivity[];
  refetch: () => void;
  statisticsInterval: IStatisticsInterval;
  handleChangeStatisticsInterval: (
    cmd: CHANGE_STATISTICS_CMD,
    date: string
  ) => void;
}

const ProfileStatistics = ({
  nftSaleByMonth,
  statisticsInterval,
  handleChangeStatisticsInterval,
}: IProfileStatisticsProps) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const web3Context = useContext(AppContext);

  // process saleEvent to statistic revenue and expenditure per day
  const revenuePerDay: Array<IStatisticPerDay> = [];
  const expenditurePerDay: Array<IStatisticPerDay> = [];

  const dayList = Array.from(
    new Set(
      nftSaleByMonth.map((event) =>
        new Date(event.date).toLocaleDateString("en-CA")
      )
    )
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
      (revenue) => new Date(revenue.date).toLocaleDateString("en-CA") === day
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
      (expenditure) =>
        new Date(expenditure.date).toLocaleDateString("en-CA") === day
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
      labels: dayList.map((day) => day),
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
        xAxes: [
          {
            barThickness: 100,
          },
        ],
      },
      plugins: {
        title: {
          display: true,
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
                "Avg. price: " +
                  avgPrice +
                  (web3Context.state.web3.chainId === CHAIN_ID.SEPOLIA
                    ? ` ETH`
                    : ` MATIC`),
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
      <div className="flex justify-center text-xl font-semibold">
        <div>
          Revenue and Expenditure Statistics from{" "}
          <Calendar
            dateFormat="yy-mm-dd"
            value={new Date(statisticsInterval.startDate)}
            onChange={(e: any) =>
              handleChangeStatisticsInterval(
                CHANGE_STATISTICS_CMD.START_DATE,
                e.value.toLocaleDateString("en-CA")
              )
            }
            maxDate={new Date(statisticsInterval.endDate)}
            className="w-[110px]"
          />{" "}
          to{" "}
          <Calendar
            dateFormat="yy-mm-dd"
            value={new Date(statisticsInterval.endDate)}
            onChange={(e: any) =>
              handleChangeStatisticsInterval(
                CHANGE_STATISTICS_CMD.END_DATE,
                e.value.toLocaleDateString("en-CA")
              )
            }
            minDate={new Date(statisticsInterval.startDate)}
            className="w-[110px]"
          />
        </div>
      </div>
      <div className="flex justify-around items-center">
        <Chart
          className="w-5/6"
          type="bar"
          data={chartData}
          options={chartOptions}
          style={{ height: "400px" }}
        />
      </div>
    </div>
  );
};

export default ProfileStatistics;
