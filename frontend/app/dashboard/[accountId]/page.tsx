"use client"
import { useParams } from "next/navigation"
import {
    Activity,
    Wifi,
    PauseCircle,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { EquityChart } from "@/components/chart/equity-chart"
import PnlChart from "@/components/chart/pnl-chart"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect } from "react"
import { getDashboardAccounts } from "@/services/dashboard"
import { DashboardAccountsData } from "@/types/dashboard"
import { useAuth } from "@/components/provider/auth-provider"


export default function AccountDetailPage() {
    const params = useParams()
    const accountId = typeof params?.accountId === 'string' ? params.accountId : ""
    const { session, isLoading: isAuthLoading } = useAuth()

    const [dashboardData, setDashboardData] = useState<DashboardAccountsData | null>()

    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        const fetchDashboardAccount = async () => {
            if (isAuthLoading) return
            const token = session?.access_token
            try {
                const res = await getDashboardAccounts(token || "", accountId)
                setDashboardData(res)
            } catch (error) {
                console.error("Error fetching dashboard account data:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchDashboardAccount()

    }, [session, isAuthLoading, accountId])

    if (isLoading) {
        return (
            <div className="space-y-6 p-6 min-h-screen bg-slate-50/50">
                {/* Top Section Skeleton */}
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <div className="flex flex-col xl:flex-row gap-6">
                            <div className="flex-1 min-w-0 h-[300px]">
                                <Skeleton className="h-full w-full rounded-xl" />
                            </div>
                            <div className="flex-1 min-w-0 xl:max-w-md space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <Skeleton className="h-24 w-full rounded-xl" />
                                    <Skeleton className="h-24 w-full rounded-xl" />
                                </div>
                                <Skeleton className="h-[200px] w-full rounded-xl" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 border-t pt-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-8 w-24" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Bots Section Skeleton */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <Skeleton className="h-6 w-48 mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
                        ))}
                    </div>
                </div>

                {/* Recent Trades Skeleton */}
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Skeleton key={i} className="h-12 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }
    console.log(dashboardData)

    const handleToggleBot = (index: number, checked: boolean) => {


        // api backend

    }
    return (
        <div className="space-y-6 p-6 min-h-screen bg-slate-50/50">
            {/* Top Section: Charts & Stats */}
            <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6">
                    <div className="flex flex-col xl:flex-row gap-6">
                        {/* Left: Equity Chart */}
                        <div className="flex-1 min-w-0">
                            <EquityChart data={dashboardData?.pnl_graph || []} />
                        </div>

                        {/* Right: PnL & Cards */}
                        <div className="flex-1 min-w-0 xl:max-w-md">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <Card className="flex flex-col items-center justify-center p-4 shadow-sm border-none bg-white">
                                    <div className="text-lg font-semibold mb-1 text-slate-700">Due Date</div>
                                    <div className="text-xs text-slate-400">Remainings</div>
                                    <div className="text-4xl font-bold text-slate-900">{dashboardData?.due_date}</div>
                                    <div className="text-xs text-slate-400 mt-1">days</div>
                                </Card>
                                <Card className="flex flex-col items-center justify-center p-4 shadow-sm border-none bg-white">
                                    <div className="text-lg font-semibold mb-1 text-slate-700">Current Active Bots</div>
                                    <div className="text-4xl font-bold text-slate-900">{dashboardData?.active_bots}</div>
                                    <div className="text-xs text-slate-400 mt-1">bots</div>
                                </Card>
                            </div>
                            <PnlChart
                                data={dashboardData?.pnl_circle || []}
                            />
                        </div>
                    </div>

                    {/* Bottom Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 border-t pt-8">
                        <div className="text-center">
                            <p className="text-xs text-slate-500 mb-1">Balance</p>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-3xl font-bold text-slate-900">฿{Math.floor(dashboardData?.balance || 0).toLocaleString()}</span>
                                <span className="text-sm font-medium text-emerald-500">({dashboardData?.pnl || 0 > 0 ? "+" : ""} ฿{dashboardData?.pnl || 0} )</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 mb-1">Total Trades</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-3xl font-bold text-slate-900">{dashboardData?.total_orders}</span>
                                <span className="text-xs text-slate-400">Orders</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 mb-1">Total Wins</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-3xl font-bold text-slate-900">{dashboardData?.total_wins}</span>
                                <span className="text-xs text-slate-400">Orders</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 mb-1">Win Rate</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-3xl font-bold text-slate-900">{dashboardData?.win_rate}</span>
                                <span className="text-sm font-bold text-slate-400">%</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Middle Section: Trading Bots Performance */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-6">Trading Bots Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dashboardData?.bots.map((bot, index) => (
                        <div key={index} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-900">{bot.name}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Version <span className="text-slate-700 font-medium ml-1">{bot.version}</span></p>
                                </div>
                                <Badge variant="secondary" className={`${bot.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'} font-normal`}>
                                    {bot.status}
                                </Badge>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">P&L</span>
                                    <span className={`font-bold ${bot.pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {bot.pnl >= 0 ? '+' : ''}฿{bot.pnl} <span className="text-xs text-slate-400 font-normal"></span>
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Today</span>
                                    <span className={`font-bold ${bot.today >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {bot.today >= 0 ? '+' : ''}฿{bot.today}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Connection</span>
                                    <Badge variant="secondary" className={`${bot.status === 'Connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} font-normal`}>
                                        {bot.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">Status :</span>
                                    <Switch checked={bot.status === 'Active'}
                                        onCheckedChange={(checked) => handleToggleBot(index, checked)}
                                        className=" origin-left" />
                                </div>
                                <span className="text-xs text-slate-400">Trades: {bot.trades}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Section: Recent Trades */}
            <Card className="border-none shadow-sm bg-white">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Recent Trades</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase">Time</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase">Symbol</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase">Type</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase text-center">Volume</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase text-right">P&L</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dashboardData?.recent_trades.map((trade, i) => (
                                <TableRow key={i} className="hover:bg-slate-50">
                                    <TableCell className="text-slate-600 font-medium py-4">{trade.time}</TableCell>
                                    <TableCell className="font-bold text-slate-900 py-4">{trade.symbol}</TableCell>
                                    <TableCell className="py-4">
                                        <span className={`text-xs font-bold uppercase ${trade.type === 'BUY' ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {trade.type}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-center py-4">{trade.volume}</TableCell>
                                    <TableCell className={`text-right font-bold py-4 ${trade.pnl >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {trade.pnl >= 0 ? '+' : ''}${Math.abs(trade.pnl).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="py-4">
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}