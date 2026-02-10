"use client"
import { CardContent, Card } from "@/components/ui/card"
import { Cell, ResponsiveContainer, PieChart, Pie } from "recharts";
import { useState } from "react";


interface ChartData {
    name: string;
    value: number; // For pie slice size (absolute)
    realValue: number; // For display
    color: string;
}

interface PnlChartProps {
    data: ChartData[];
    dueDate: number;
    countValue: number;
    countLabel: string;
}

export default function PnlChart({ data, dueDate, countValue, countLabel }: PnlChartProps) {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
                <Card className="flex flex-col items-center justify-center p-4 shadow-sm border-none bg-white">
                    <div className="text-sm font-semibold mb-1 text-slate-700">Due Date</div>
                    <div className="text-xs text-slate-400 mb-2">Remainings</div>
                    <div className="text-4xl font-bold text-slate-900">{dueDate}</div>
                    <div className="text-xs text-slate-400 mt-1">days</div>
                </Card>
                <Card className="flex flex-col items-center justify-center p-4 shadow-sm border-none bg-white">
                    <div className="text-sm font-semibold mb-1 text-center text-slate-700">{countLabel}</div>
                    <div className="text-4xl font-bold text-slate-900 mt-4">{countValue}</div>
                    <div className="text-xs text-slate-400 mt-1">{countLabel.includes("Bots") ? "Bots" : "Accounts"}</div>
                </Card>
            </div>
            <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <div className="h-[160px] w-[160px] relative shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        innerRadius={45}
                                        outerRadius={65}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-bold text-slate-700">P&L</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="space-y-3 text-sm flex-1 w-full">
                            {data.map((entry, index) => (
                                <div className="flex items-center justify-between gap-2" key={index}>
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: entry.color }}></div>
                                        <span className="text-slate-600 truncate">{entry.name} :</span>
                                    </div>
                                    <span className="font-bold text-slate-900 whitespace-nowrap">
                                        {entry.realValue >= 0 ? '+' : ''} ฿ {entry.realValue.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}