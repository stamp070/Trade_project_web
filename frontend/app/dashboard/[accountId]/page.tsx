"use client"
import { useParams } from "next/navigation"
import { DeleteBotButton } from "./components/delete-bot-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { getDashboardAccounts } from "@/services/mt5"
import { updateBotStatus } from "@/services/bot"
import { DashboardAccountsData } from "@/types/dashboard"
import { Bot } from "@/types/bot"
import { useAuth } from "@/components/provider/auth-provider"


export default function AccountDetailPage() {
    const params = useParams()
    const accountId = typeof params?.accountId === 'string' ? params.accountId : ""
    const { session, isLoading: isAuthLoading } = useAuth()

    const [dashboardData, setDashboardData] = useState<DashboardAccountsData | null>()

    const [isLoading, setIsLoading] = useState(true)

    const [isBotConnected, setIsBotConnected] = useState<Bot[] | null>()

    const [isOverdue, setIsOverdue] = useState(false)


    const fetchData = async (signal?: AbortSignal) => {
        if (!session?.access_token) {
            setIsLoading(false)
            return
        }
        const token = session.access_token
        try {
            const res = await getDashboardAccounts(token || "", accountId)
            if (!signal || !signal.aborted) {
                setDashboardData(res)
                setIsBotConnected(res?.bots)
                console.log(res?.invoice_status.status)
            }
        } catch (error) {
            if (!signal || !signal.aborted) {
                console.error("Error fetching dashboard account data:", error)
            }
        } finally {
            if (!signal || !signal.aborted) {
                setIsLoading(false)
            }
        }
    }

    useEffect(() => {
        if (isAuthLoading) return
        const abortController = new AbortController()

        fetchData(abortController.signal)

        return () => {
            abortController.abort()
        }
    }, [session, isAuthLoading, accountId])

    const handleToggleBot = async (index: number, checked: boolean) => {
        const bot = isBotConnected?.[index]
        if (!bot) return

        const newStatus = checked ? "Connected" : "Disconected"
        const previousBots = isBotConnected
        setIsBotConnected(prev => prev?.map((b, i) => i === index ? { ...b, connection: newStatus } : b))
        try {
            const updatedBots = await updateBotStatus(session?.access_token || "", bot.bot_id, newStatus)

            if (updatedBots && updatedBots.length > 0) {
                const updatedBotFromApi = updatedBots[0]

                setDashboardData(prev => {
                    if (!prev) return prev
                    return {
                        ...prev,
                        bots: prev.bots.map(b => b.bot_id === bot.bot_id ? { ...b, connection: updatedBotFromApi.connection } : b)
                    }
                })

                setIsBotConnected(prev => prev?.map(b => b.bot_id === bot.bot_id ? { ...b, connection: updatedBotFromApi.connection } : b))
            } else {
                setIsBotConnected(previousBots)
            }
        } catch (error) {
            console.error("Error updating bot status:", error)
            setIsBotConnected(previousBots)
        }
    }

    if (isLoading) {
        return (
            <div className="space-y-6 p-6 min-h-screen bg-slate-50/50">
                {/* Top Section Skeleton */}
                <Card className="border-none shadow-sm bg-white">
                    <CardContent className="p-6">
                        <Skeleton className="h-115 w-full rounded-xl" />
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

                                {dashboardData?.invoice_status?.status === "active" ? (
                                    <Card className="flex flex-col items-center justify-center p-4 shadow-sm border-none bg-white">
                                        <div className="text-xl font-semibold mb-1 text-slate-700">Next Due Date</div>
                                        <div className="text-xs text-slate-400">Remaining</div>
                                        <div className="text-4xl font-bold text-slate-900">{dashboardData?.invoice_status?.day_left || 0}</div>
                                        <div className="text-xs text-slate-400 mt-1">days</div>
                                    </Card>
                                ) : dashboardData?.invoice_status?.status === "trial" ? (
                                    <Card className="flex flex-col items-center justify-center p-4 shadow-sm border-blue-200 bg-blue-50/50">
                                        <div className="text-xl font-bold mb-1 text-blue-700">Trial Period</div>
                                        <div className="text-xs text-blue-500 font-medium">Remaining</div>
                                        <div className="text-4xl font-bold text-blue-800">{dashboardData?.invoice_status?.day_left || 0}</div>
                                        <div className="text-xs text-blue-500 font-medium mt-1">days</div>
                                    </Card>
                                ) : dashboardData?.invoice_status?.status === "overdue" || dashboardData?.invoice_status?.status === "unpaid" ? (
                                    <Card className={`relative flex flex-col items-center justify-center p-4 shadow-md border-2 border-red-400 bg-red-50`}>

                                        <div className={`relative z-10 text-xl font-black tracking-wider mb-1 text-red-500`}>
                                            {dashboardData?.invoice_status?.status.toUpperCase()}
                                        </div>

                                        <div className={`relative z-10 text-sm font-semibold text-red-500`}>
                                            Days Left
                                        </div>

                                        <div className={`relative z-10 text-4xl font-black my-1 text-red-800`}>
                                            {dashboardData?.invoice_status?.day_left || 0}
                                        </div>

                                        <a href="/bills" className={`z-10 mt-1 px-4 py-1.5 text-xs font-bold text-white rounded-full bg-red-600 hover:bg-red-700`}>
                                            Pay Now
                                        </a>
                                    </Card>
                                ) : (
                                    <Card className="flex flex-col items-center justify-center p-4 shadow-sm border-none bg-white">
                                        <div className="text-xl font-semibold mb-1 text-slate-700">Next Due Date</div>
                                        <div className="text-4xl font-bold text-slate-700">0</div>
                                        <div className="text-xs text-slate-500 mt-1">days</div>
                                    </Card>
                                )}

                                <Card className="flex flex-col items-center justify-center p-4 shadow-sm border-none bg-white">
                                    <div className="text-lg font-semibold mb-1 text-slate-700">Current Active Bots</div>
                                    <div className="text-4xl font-bold text-slate-900">{dashboardData?.bots.filter((bot) => bot.connection === "Connected").length || 0}</div>
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
                                <span className="text-3xl font-bold text-slate-900">${Math.floor(dashboardData?.balance || 0).toLocaleString()}</span>
                                <span className="text-sm font-medium text-emerald-500">({dashboardData?.pnl || 0 > 0 ? "+" : ""} ${dashboardData?.pnl || 0} )</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 mb-1">Total Trades</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-3xl font-bold text-slate-900">{dashboardData?.total_orders || 0}</span>
                                <span className="text-xs text-slate-400">Orders</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 mb-1">Total Wins</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-3xl font-bold text-slate-900">{dashboardData?.total_wins || 0}</span>
                                <span className="text-xs text-slate-400">Orders</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 mb-1">Win Rate</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-3xl font-bold text-slate-900">{dashboardData?.win_rate || 0}</span>
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
                    {(dashboardData?.bots?.length ?? 0) > 0 ? dashboardData?.bots.map((bot, index) => (

                        <div key={bot.bot_id} className={`border rounded-xl p-4 transition-shadow ${dashboardData?.invoice_status.status === "overdue" ? "opacity-60 bg-slate-50 cursor-not-allowed" : "hover:shadow-md"}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-900">{bot.name}</h3>
                                    <p className="text-xs text-slate-500 mt-0.5">Version <span className="text-slate-700 font-medium ml-1">{bot.version}</span></p>
                                </div>
                                <Badge variant="secondary" className={`${bot.connection === 'Connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'} font-normal`}>
                                    {bot.connection}
                                </Badge>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">P&L</span>
                                    <span className={`font-bold ${bot.pnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {bot.pnl >= 0 ? '+' : ''}${bot.pnl} <span className="text-xs text-slate-400 font-normal"></span>
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Today</span>
                                    <span className={`font-bold ${bot.today >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {bot.today >= 0 ? '+' : ''}${bot.today}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Connection</span>
                                    <Badge variant="secondary" className={`${isBotConnected?.[index]?.connection === 'Connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} font-normal`}>
                                        {isBotConnected?.[index]?.connection === "Connected" ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">Status :</span>
                                    <Switch
                                        checked={isBotConnected?.[index]?.connection === 'Connected'}
                                        onCheckedChange={(checked) => handleToggleBot(index, checked)}
                                        disabled={dashboardData?.invoice_status.status === "overdue"}
                                        className="origin-left cursor-pointer"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-400">Trades: {bot.trades}</span>
                                    <DeleteBotButton
                                        token={session?.access_token || ""}
                                        botId={bot.bot_id}
                                        botName={bot.name}
                                        disabled={dashboardData?.invoice_status.status === "overdue"}
                                        onSuccess={() => fetchData()}
                                    />
                                </div>
                            </div>
                        </div>
                    ))
                        :
                        <div className="w-full col-start-2">
                            <p className="text-center text-slate-500">No Bots Available.</p>
                        </div>
                    }
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
                            {(dashboardData?.recent_trades?.length ?? 0) > 0 ? dashboardData?.recent_trades.map((trade, i) => (
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
                            ))
                                : <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4 text-slate-500">
                                        No recent trades
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}