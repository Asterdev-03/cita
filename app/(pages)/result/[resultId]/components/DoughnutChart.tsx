"use client";

import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { Trophy } from "lucide-react";

interface DoughnutChartProps {
  score: number;
}

export default function DoughnutChart({ score }: DoughnutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const weight = [score, 100 - score];

        const labels = ["Final Score", "Need for Improvemnent"];

        const data = {
          labels: labels,
          datasets: [
            {
              data: weight,
              fill: true,
              backgroundColor: [
                "rgba(126, 34 ,206, 0.5)",
                "rgba(255,255,255,1)",
              ],
              hoverOffset: 4,
              borderColor: "rgba(0,0,0,0.2)",
              borderWidth: 2,
              lineTension: 0.2,
            },
          ],
        };

        const config: { type: any; data: typeof data } = {
          type: "doughnut",
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
    <>
      <div className="relative h-full w-full">
        <canvas ref={canvasRef} height={100} />
      </div>
      <div className="flex space-x-3 items-center justify-center">
        <Trophy className="text-yellow-900" />
        <h2 className="font-semibold text-gray-900 leading-loose">
          Final Score {"   "}:{"   "}
          <span className="text-3xl font-bold text-purple-700">{score}%</span>
        </h2>
      </div>
    </>
  );
}
