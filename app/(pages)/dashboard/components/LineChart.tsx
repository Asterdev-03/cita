"use client";

import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";

const colors = {
  purple: {
    default: "rgba(149, 76, 233, 1)",
    half: "rgba(149, 76, 233, 0.5)",
    quarter: "rgba(149, 76, 233, 0.25)",
    zero: "rgba(149, 76, 233, 0)",
  },
};

const LineChart = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 16, 0, 600);
        gradient.addColorStop(0, colors.purple.half);
        gradient.addColorStop(0.65, colors.purple.quarter);
        gradient.addColorStop(1, colors.purple.zero);

        const weight = [60.0, 60.2, 59.1, 61.4, 59.9];

        const labels = [
          "Interview 1",
          "Interview 2",
          "Interview 3",
          "Interview 4",
          "Interview 5",
        ];

        const data = {
          labels: labels,
          datasets: [
            {
              backgroundColor: gradient,
              label: "Last 5 interview scores",
              data: weight,
              fill: true,
              borderWidth: 2,
              borderColor: colors.purple.default,
              lineTension: 0.2,
              pointBackgroundColor: colors.purple.default,
              pointRadius: 3,
            },
          ],
        };

        const config: { type: any; data: typeof data } = {
          type: "line",
          data: data,
        };

        const myLineChart = new Chart(ctx, config);

        return function cleanup() {
          myLineChart.destroy();
        };
      }
    }
  }, []);

  return (
    <div className="relative h-full w-full">
      <canvas id="myChart" ref={canvasRef} height={100} />
    </div>
  );
};

export default LineChart;
