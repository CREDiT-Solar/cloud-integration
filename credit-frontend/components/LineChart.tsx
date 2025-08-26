import React from "react";
import { Dimensions, View } from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryAxis,
  VictoryScatter,
  VictoryLegend,
} from "victory";

export interface LineChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
  legend?: string[];
}

export interface LineChartComponentProps {
  data: LineChartData;
  width?: number;
  height?: number;
}

export default function LineChartComponent({
  data,
  width,
  height,
}: LineChartComponentProps) {
  const screenWidth = Dimensions.get("window").width;

  const transformedDatasets = data.datasets.map((dataset, idx) =>
    dataset.data.map((y, i) => ({
      x: data.labels[i],
      y,
      color: dataset.color ? dataset.color(1) : "black",
      strokeWidth: dataset.strokeWidth || 2,
    }))
  );

  return (
    <View>
      <VictoryChart
        theme={VictoryTheme.material}
        domainPadding={{ x: 25, y: 20 }}
        width={width || screenWidth - 20}
        height={height || 320}
      >
 
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "#ccc" },
            tickLabels: { fontSize: 12, fill: "#374151" },
          }}
        />
  
        <VictoryAxis
          style={{
            axis: { stroke: "#ccc" },
            // tickLabels: { fontSize: 12, fill: "#374151" },
            tickLabels: {
            fontSize: 8,
            angle: data.labels.length > 10 ? -45 : 0, 
            padding: 5,
          },
          }}
        />
   
        {transformedDatasets.map((dataset, idx) => [
          <VictoryLine
            key={`line-${idx}`}
            data={dataset}
            interpolation="natural"
            style={{
              data: {
                stroke: dataset[0].color,
                strokeWidth: dataset[0].strokeWidth,
              },
            }}
          />,
          <VictoryScatter
            key={`scatter-${idx}`}
            data={dataset}
            size={4}
            style={{
              data: { fill: dataset[0].color },
            }}
          />,
        ])}

        {data.legend && (
          <VictoryLegend
            x={50}
            y={10}
            orientation="horizontal"
            gutter={20}
            style={{ labels: { fontSize: 12 } }}
            data={data.legend.map((label, idx) => ({
              name: label,
              symbol: { fill: transformedDatasets[idx][0].color },
            }))}
          />
        )}
      </VictoryChart>
    </View>
  );
}

