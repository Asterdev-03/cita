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

interface LineChartProps {
  scores: number[];
}

const LineChart: React.FC<LineChartProps> = ({ scores }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const gradient = ctx.createLinearGradient(0, 16, 0, 600);
        gradient.addColorStop(0, colors.purple.half);
        gradient.addColorStop(0.65, colors.purple.quarter);
        gradient.addColorStop(1, colors.purple.zero);

        const labels = Array.from(
          { length: scores.length },
          (_, index) => `Interview ${index + 1}`
        );

        const data = {
          labels: labels,
          datasets: [
            {
              backgroundColor: gradient,
              label: "Interview scores",
              data: scores,
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
  }, [scores]);

  return (
    <div className="relative h-full w-full">
      <canvas id="myChart" ref={canvasRef} height={100} />
    </div>
  );
};

export default LineChart;
