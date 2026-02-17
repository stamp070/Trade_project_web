import { CardContent, Card } from "@/components/ui/card"
import { Cell, ResponsiveContainer, PieChart, Pie } from "recharts";
import { PnlCircle } from "@/types/dashboard"


const COLOR = ["#db2777", "#fbbf24", "#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"]

export default function PnlChart({ data }: { data: PnlCircle[] }) {
    const hasData = data && data.length > 0 && data.some(item => item.value > 0);
    const chartData = hasData ? data : [{ name: 'No Data', value: 1 }];

    return (
        <div className="flex flex-col gap-6">
            <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <div className="h-[160px] w-[160px] relative shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        innerRadius={45}
                                        outerRadius={65}
                                        paddingAngle={hasData ? 5 : 0}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={hasData ? COLOR[index % COLOR.length] : "#cbd5e1"}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-lg font-bold text-slate-700">P&L</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="space-y-3 text-sm flex-1 w-full">
                            {hasData ? (
                                data.map((entry, index) => (
                                    <div className="flex items-center justify-between gap-2" key={index}>
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: COLOR[index % COLOR.length] }}></div>
                                            <span className="text-slate-600 truncate">{entry.name} :</span>
                                        </div>
                                        <span className={`font-bold whitespace-nowrap ${entry.value >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {entry.value >= 0 ? '+' : ''} ฿ {entry.value.toLocaleString()}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-slate-400 py-4">
                                    No Data Available
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}