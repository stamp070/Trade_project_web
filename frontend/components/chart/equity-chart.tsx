"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { PnlGraph, DashboardAccountsData } from "@/types/dashboard"

export const description = "A linear line chart"

const chartConfig: ChartConfig = {
    pnl: {
        label: "pnl",
        color: "var(--chart-1)",
    },
}

interface EquityChartProps {
    data: PnlGraph[]
}

export function EquityChart({ data }: EquityChartProps) {
    return (
        <Card className={`flex flex-col h-full`}>
            <CardHeader>
                <CardTitle className="text-lg">Profit & Loss Overview</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
                <ChartContainer config={chartConfig} className="max-h-full w-full h-full">
                    <LineChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="pnl"
                            type="linear"
                            stroke="var(--color-pnl)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
