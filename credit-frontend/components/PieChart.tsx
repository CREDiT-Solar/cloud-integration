import React from "react";
import { Dimensions, View } from "react-native";
import { VictoryPie } from "victory";

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
  width,
  height,
}: PieChartComponentProps) {
  const screenWidth = Dimensions.get("window").width;

  const chartData = data.map((item) => ({
    x: item.name,
    y: item.population,
    fill: item.color,
  }));

  return (
    <View>
      <VictoryPie
        data={chartData}
        width={width || screenWidth - 20}
        height={height || 320}
        colorScale={chartData.map((d) => d.fill)} 
        labels={({ datum }: { datum: { x: string; y: number } }) =>
          `${datum.x}\n${datum.y} kWh`
        }
        style={{
          labels: {
            fill: "#000",
            fontSize: 12,
          },
        }}
        innerRadius={50}  
        padAngle={2}      
      />
    </View>
  );
}
