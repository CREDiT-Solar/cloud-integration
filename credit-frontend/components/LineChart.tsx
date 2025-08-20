import React from "react";
import { View } from "react-native";
import { LineChart } from "react-native-chart-kit";

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
  width = 460,
  height = 320,
}: LineChartComponentProps) {
  return (
    <View>
      <LineChart
        data={data}
        width={width}
        height={height}
        chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(34, 197, 94, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
            propsForDots: { r: "4" },
            strokeWidth: 2,
            style: {
                borderRadius: 8,
                backgroundColor: "#ffffff", 
            },
            }}
        bezier
        withShadow={false}
        style={{
            borderRadius: 8,
            backgroundColor: "#ffffff",
            marginTop: 8, 
            }}
        verticalLabelRotation={0}
      />
    </View>
  );
}
