import React from "react";
import { View } from "react-native";
import { PieChart } from "react-native-chart-kit";

export interface PieDataItem {
  name: string;
  population: number;
  color: string;
  legendFontColor?: string;
  legendFontSize?: number;
}

export interface PieChartComponentProps {
  data: PieDataItem[];
  width?: number;
  height?: number;
}

export default function PieChartComponent({
  data,
  width = 360,
  height = 320,
}: PieChartComponentProps) {
  return (
    <View>
      <PieChart
        data={data}
        width={width}
        height={height}
        chartConfig={{ color: () => "#000", backgroundColor: "#fff" }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="30"
        center={[0, 0]}
        hasLegend={false}
        absolute
      />
    </View>
  );
}