import React, { useContext, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import TaskContext from "./context/TaskContext";
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});
export default function DonutChart() {
  const {tasks} = useContext(TaskContext);
  const [chartData, setChartData] = useState({
    options: {
      chart: {
        type: "donut",
      },
      labels: ["Completed", "Not Complete"], // Labels for the segments
      colors: ["#00E396", "#FF4560"], // Colors
      responsive: [
        {
          breakpoint: 480,
          options: {
            // chart: {
            //   width: 200,
            // },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      noData: {
        text: "No data available. Add some tasks to see the chart.",
        align: "center",
        verticalAlign: "middle",
        offsetX: 0,
        offsetY: 0,
        style: {
          fontSize: "16px",
        },
      }
    }
  });

  useEffect(() => {
    if (tasks.length === 0){
      setChartData({
        ...chartData,
        series: [],
      });
      return;
    }
    const completedTasks = tasks.filter(
      (task) => task.completed === true
    ).length;
    const notCompletedTasks = tasks.length - completedTasks;
     setChartData({
      ...chartData,
      series: [completedTasks, notCompletedTasks],
    });
  }, [tasks]);

  return (
    <div id="chart" className="sm:mx-auto sm:w-full sm:max-w-sm">
      {tasks && tasks.length > 0  && <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="donut"
      />}
    </div>
  );
}
