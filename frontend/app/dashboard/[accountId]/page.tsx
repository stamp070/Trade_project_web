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
import { EquityChart } from "@/components/chart/equity-chart"
import PnlChart from "@/components/chart/pnl-chart"
import { Switch } from "@/components/ui/switch"
import { useState, useEffect } from "react"

// --- Mock Data (จำลองข้อมูลจาก DB) ---
type AccountData = {
    id: string;
    name: string;
    balance: number;
    pnl: number;
    dueDate: number;
    activeBots: number;
    winRate: number;
    totalOrders: number;
    totalWins: number;
    bots: Array<{ name: string; version: string; pnl: number; percent: number; today: number; status: string; connection: string; trades: number }>;
    recentTrades: Array<{ time: string; symbol: string; type: string; volume: number; price: number; pnl: number }>;
    equityData: Array<{ month: string; equity: number }>;
}

const accountsData: Record<string, AccountData> = {
    "5044110616": { // Main Account
        id: "5044110616",
        name: "Main Account",
        balance: 17248.00,
        pnl: 1248.00,
        dueDate: 14,
        activeBots: 2,
        winRate: 57,
        totalOrders: 369,
        totalWins: 211,
        bots: [
            { name: "EUR/USD Bot", version: "Eur_v.1", pnl: 847, percent: 16.94, today: 124, status: "Active", connection: "Connected", trades: 156 },
            { name: "XAU/USD Bot", version: "Xau_v.1", pnl: 234, percent: 2.93, today: -45, status: "Active", connection: "Connected", trades: 127 },
            { name: "JPY/USD Bot", version: "Jpy_v.1", pnl: 167, percent: 5.57, today: 0, status: "Paused", connection: "Connected", trades: 86 },
        ],
        recentTrades: [
            { time: "14:32:15", symbol: "EUR/USD", type: "BUY", volume: 0.1, price: 1.0845, pnl: 45.20 },
            { time: "14:15:32", symbol: "XAU/USD", type: "SELL", volume: 0.05, price: 2034.50, pnl: -23.10 },
            { time: "13:45:18", symbol: "EUR/USD", type: "BUY", volume: 0.2, price: 1.0832, pnl: 78.90 },
        ],
        equityData: [
            { month: "Jan", equity: 500 },
            { month: "Feb", equity: 800 },
            { month: "Mar", equity: 1200 },
            { month: "Apr", equity: 1400 },
            { month: "May", equity: 1600 },
            { month: "Jun", equity: 1848 },
        ]
    },
    "5044110617": { // Secondary Account
        id: "5044110617",
        name: "Secondary Account",
        balance: 8599.32,
        pnl: -100.68,
        dueDate: 14,
        activeBots: 1,
        winRate: 66,
        totalOrders: 3,
        totalWins: 2,
        bots: [
            { name: "EUR/USD Bot", version: "Eur_v.1", pnl: -100.68, percent: -0.15, today: -50.32, status: "Active", connection: "Connected", trades: 3 },
            { name: "XAU/USD Bot", version: "Xau_v.1", pnl: 0, percent: 0, today: 0, status: "Paused", connection: "Disconnected", trades: 0 },
        ],
        recentTrades: [
            { time: "14:32:15", symbol: "EUR/USD", type: "BUY", volume: 0.1, price: 1.0845, pnl: 45.20 },
            { time: "13:45:18", symbol: "EUR/USD", type: "BUY", volume: 0.2, price: 1.0832, pnl: 78.90 },
        ],
        equityData: [
            { month: "Jan", equity: 8600 },
            { month: "Feb", equity: 8550 },
            { month: "Mar", equity: 8700 },
            { month: "Apr", equity: 8400 },
            { month: "May", equity: 8500 },
            { month: "Jun", equity: 8599 },
        ]
    }
}

export default function AccountDetailPage() {
    const params = useParams()
    const accountId = typeof params?.accountId === 'string' ? params.accountId : ""
    const [accountDetails, setAccountDetails] = useState<AccountData>(() => {
        return accountsData[accountId]
    })
    useEffect(() => {
        const data = accountsData[accountId]
        setAccountDetails(data)
    }, [accountId])

    const handleToggleBot = (index: number, checked: boolean) => {

        setAccountDetails(prev => {
            const updatedBots = [...prev.bots]
            updatedBots[index] = {
                ...updatedBots[index],
                status: checked ? "Active" : "Paused",
                connection: checked ? "Connected" : "Disconnected"
            }
            const newActiveCount = updatedBots.filter(bot => bot.status === "Active").length
            return {
                ...prev,
                bots: updatedBots,
                activeBots: newActiveCount
            }
        })

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
                            <EquityChart data={accountDetails.equityData} />
                        </div>

                        {/* Right: PnL & Cards */}
                        <div className="flex-1 min-w-0 xl:max-w-md">
                            <PnlChart
                                data={accountDetails.bots.map((bot, index) => ({
                                    name: bot.name,
                                    value: Math.abs(bot.pnl),
                                    realValue: bot.pnl,
                                    color: ["#db2777", "#fbbf24", "#3b82f6", "#10b981", "#8b5cf6"][index % 5]
                                })).filter(d => d.value > 0)}
                                dueDate={accountDetails.dueDate}
                                countValue={accountDetails.activeBots}
                                countLabel="Current Active Bots"
                            />
                        </div>
                    </div>

                    {/* Bottom Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8 border-t pt-8">
                        <div className="text-center">
                            <p className="text-xs text-slate-500 mb-1">Balance</p>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-3xl font-bold text-slate-900">฿{Math.floor(accountDetails.balance).toLocaleString()}</span>
                                <span className="text-sm font-medium text-emerald-500">({accountDetails.pnl > 0 ? "+" : ""} ฿{accountDetails.pnl} )</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 mb-1">Total Trades</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-3xl font-bold text-slate-900">{accountDetails.totalOrders}</span>
                                <span className="text-xs text-slate-400">Orders</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 mb-1">Total Wins</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-3xl font-bold text-slate-900">{accountDetails.totalWins}</span>
                                <span className="text-xs text-slate-400">Orders</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 mb-1">Win Rate</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-3xl font-bold text-slate-900">{accountDetails.winRate}</span>
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
                    {accountDetails.bots.map((bot, index) => (
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
                                        {bot.pnl >= 0 ? '+' : ''}฿{bot.pnl} <span className="text-xs text-slate-400 font-normal">({bot.percent >= 0 ? '+' : ''}{bot.percent}%)</span>
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
                                    <Badge variant="secondary" className={`${bot.connection === 'Connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'} font-normal`}>
                                        {bot.connection}
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
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase text-center">Price</TableHead>
                                <TableHead className="text-xs font-semibold text-slate-500 uppercase text-right">P&L</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {accountDetails.recentTrades.map((trade, i) => (
                                <TableRow key={i} className="hover:bg-slate-50">
                                    <TableCell className="text-slate-600 font-medium py-4">{trade.time}</TableCell>
                                    <TableCell className="font-bold text-slate-900 py-4">{trade.symbol}</TableCell>
                                    <TableCell className="py-4">
                                        <span className={`text-xs font-bold uppercase ${trade.type === 'BUY' ? 'text-emerald-600' : 'text-red-500'}`}>
                                            {trade.type}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-center py-4">{trade.volume}</TableCell>
                                    <TableCell className="text-slate-600 text-center py-4">{trade.price}</TableCell>
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