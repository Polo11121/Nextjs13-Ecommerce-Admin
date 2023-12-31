"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface OverviewProps {
  data: any[];
}

export const Overview = ({ data }: OverviewProps) => (
  <ResponsiveContainer width="100%" height={365}>
    <BarChart data={data}>
      <XAxis
        dataKey="name"
        stroke="#888888"
        tickLine={false}
        axisLine={false}
        fontSize={12}
      />
      <YAxis
        stroke="#888888"
        tickLine={false}
        axisLine={false}
        fontSize={12}
        tickFormatter={(value) => `$${value}`}
      />
      <Bar dataKey="total" fill="#3498db" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);
