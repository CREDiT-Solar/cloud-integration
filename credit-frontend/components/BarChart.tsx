
import React from "react";
import { Dimensions } from "react-native";
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLabel,
  VictoryLegend,
  VictoryGroup,
} from "victory";

export type BarChartData = {
  labels: string[]; 
  legend?: string[]; 
  datasets: { data: number[]; color?: string }[]; // for multiple dataset
};

type Props = {
  data: BarChartData;
  width?: number;
  height?: number;
};

const BarchartComponent: React.FC<Props> = ({ data, width, height }) => {
  const screenWidth = Dimensions.get("window").width;

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={{ x: 20, y: 20 }}
      width={width || screenWidth - 20}
      height={height || 300}
    >

      <VictoryAxis
        dependentAxis
        style={{
          tickLabels: { fontSize: 10, padding: 3 },
          axis: { stroke: "#888" },
        }}
      />

      <VictoryAxis
        tickFormat={(t) => `${t}`}
        style={{
          tickLabels: {
            fontSize: 8,
            angle: data.labels.length > 10 ? -45 : 0, 
            padding: 5,
          },
          axis: { stroke: "#888" },
        }}
      />

      {data.legend && (
        <VictoryLegend
          x={50}
          y={0}
          orientation="horizontal"
          gutter={20}
          style={{ labels: { fontSize: 10 } }}
          data={data.legend.map((l, i) => ({
            name: l,
            symbol: { fill: data.datasets[i]?.color || "#000" },
          }))}
        />
      )}

      {/* Grouped Bar */}
      <VictoryGroup
        offset={Math.max(12, (200 / data.labels.length))} // adjust data group interval
      >
        {data.datasets.map((set, setIndex) => (
          <VictoryBar
            key={setIndex}
            data={data.labels.map((label, i) => ({
              x: label,
              y: set.data[i],
            }))}
            style={{
              data: {
                fill: set.color || "#4285F4",
                // Adjust bar width
                width: Math.min(40, Math.max(8, 300 / data.labels.length)),
              },
              labels: { fontSize: 8 },
            }}
            labels={({ datum }) => `${datum.y}`}
            labelComponent={<VictoryLabel dy={-10} />}
          />
        ))}
      </VictoryGroup>
    </VictoryChart>
  );
};

export default BarchartComponent;







