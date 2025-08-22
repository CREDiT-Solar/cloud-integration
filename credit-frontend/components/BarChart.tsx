import React from "react";
import { Dimensions } from "react-native";
import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryLabel,
  VictoryGroup,
  VictoryLegend,
} from "victory";

export type BarChartData = {
  labels: string[];
  legend: string[];
  data: number[][];        
  barColors: string[];     
};

type Props = {
  data: BarChartData;
  width?: number;
  height?: number;
};

const BarchartComponent: React.FC<Props> = ({ data, width, height }) => {
  const screenWidth = Dimensions.get("window").width;

  const datasets = data.legend.map((legend, datasetIdx) =>
    data.labels.map((label, i) => ({
      x: label,
      y: data.data[i][datasetIdx],
    }))
  );

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={{ x: 40, y: 20 }}
      width={width || screenWidth - 20}
      height={height || 280}
    >

      <VictoryAxis
        dependentAxis
        style={{
          tickLabels: { fontSize: 12, padding: 5 },
          axis: { stroke: "#888" },
        }}
      />

      <VictoryAxis
        style={{
          tickLabels: { fontSize: 12, padding: 5 },
          axis: { stroke: "#888" },
        }}
      />

      <VictoryGroup offset={40}>
        {datasets.map((dataset, idx) => (
          <VictoryBar
            key={idx}
            data={dataset}
            labels={({ datum }) => `${datum.y}`}
            style={{
              data: { fill: data.barColors[idx] },
              labels: { fill: "#000", fontSize: 12, padding: -10 },
            }}
            labelComponent={<VictoryLabel dy={-15} />}
          />
        ))}
      </VictoryGroup>

      <VictoryLegend
        x={50}
        y={10}
        orientation="horizontal"
        gutter={20}
        style={{ labels: { fontSize: 12 } }}
        data={data.legend.map((label, idx) => ({
          name: label,
          symbol: { fill: data.barColors[idx] },
        }))}
      />
    </VictoryChart>
  );
};

export default BarchartComponent;





