"use client";

import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { Trophy } from "lucide-react";

interface BarChartProps {
  weight: number[];
}

export default function BarChart({ weight }: BarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        // const weight = [5, 20, 10, 40, 80, 22, 40];
        console.log(weight);

        const labels = ["Angry", "Happy", "Sad", "Surprised", "Neutral"];

        const data = {
          labels: labels,
          datasets: [
            {
              //   label: "Emotions",
              data: weight,
              fill: true,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                // "rgba(255, 159, 64, 0.2)",
                // "rgba(255, 205, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(201, 203, 207, 0.2)",
              ],
              hoverOffset: 4,
              borderColor: [
                "rgb(255, 99, 132)",
                // "rgb(255, 159, 64)",
                // "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(54, 162, 235)",
                "rgb(153, 102, 255)",
                "rgb(201, 203, 207)",
              ],
              borderWidth: 2,
              lineTension: 0.2,
            },
          ],
          options: {
            responsive: false,
          },
        };

        const config: { type: any; data: typeof data } = {
          type: "bar",
          data: data,
        };

        const myLineChart = new Chart(ctx, config);

        return function cleanup() {
          myLineChart.destroy();
        };
      }
    }
  }, [weight]);

  return (
    <div className="relative">
      <canvas ref={canvasRef} height={200} />
    </div>
  );
}
