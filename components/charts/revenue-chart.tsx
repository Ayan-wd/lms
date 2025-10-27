'use client'

import { FC } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

interface RevenueData {
  month: string
  revenue: number
  expenses?: number
}

interface RevenueChartProps {
  data: RevenueData[]
}

export const RevenueChart: FC<RevenueChartProps> = ({ data }) => {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="revenue" fill="#10b981" />
          {data.some(d => typeof d.expenses === 'number') && (
            <Bar dataKey="expenses" fill="#ef4444" />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}