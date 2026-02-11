import { EquityChart } from "@/components/chart/equity-chart"
import PnlChart from "@/components/chart/pnl-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableHead, TableHeader, TableRow, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash, Trash2, XCircle } from "lucide-react"
import { CheckCircle2 } from "lucide-react"

const accounts = [
    {
        name: "Demo Account",
        id: "12345678",
        token: "demo-token-1234567890abcdef1234567890abcdef",
        status: "Connected",
        balance: 10000.00,
    },
    {
        name: "Live Account",
        id: "87654321",
        token: "live-token-abcdef1234567890abcdef1234567890",
        status: "Disconnected",
        balance: 5000.00,
    },
]

const accountDetails = {
    name: "Demo Account",
    id: "12345678",
    token: "demo-token-1234567890abcdef1234567890abcdef",
    status: "Connected",
    balance: 10000.00,
    pnl: 1248,
    totalOrders: 100,
    totalWins: 50,
    winRate: 50,
}

const overallEquityData = [
    { month: "Jan", equity: 8600 },
    { month: "Feb", equity: 9550 },
    { month: "Mar", equity: 10700 },
    { month: "Apr", equity: 11400 },
    { month: "May", equity: 12500 },
    { month: "Jun", equity: 13599 },
]

const overallBots = [
    { name: "EUR/USD Bot", pnl: 847 },
    { name: "XAU/USD Bot", pnl: 234 },
    { name: "JPY/USD Bot", pnl: 167 },
]

const pnlChartData = [
    { name: "Main Account", value: 1248, realValue: 1248, color: "#db2777" },
    { name: "Secondary Account", value: 100.68, realValue: -100.68, color: "#fbbf24" },
]

export default function Dashboard() {
    return (
        <div className="space-y-6 p-6 min-h-screen bg-slate-50/50">
            <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-6">
                    <div className="flex flex-col xl:flex-row gap-6">
                        <div className="flex-1 min-w-0 ">
                            <EquityChart data={overallEquityData} />
                        </div>
                        <div className="flex-1 min-w-0 xl:max-w-md">
                            <PnlChart
                                data={pnlChartData}
                                dueDate={14}
                                countValue={2}
                                countLabel="Current Accounts"
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
            <div>
                <Card className="shadow-sm border-none bg-white">
                    <CardHeader>
                        <CardTitle>MT5 Accounts</CardTitle>
                        <CardDescription>Manage your connected trading accounts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead>Name</TableHead>
                                        <TableHead>MT5_ID</TableHead>
                                        <TableHead>Token</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Balance</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {accounts.map((account, index) => (
                                        <TableRow key={index} className="hover:bg-slate-50">
                                            <TableCell className="font-medium text-slate-900">{account.name}</TableCell>
                                            <TableCell className="text-slate-500">{account.id}</TableCell>
                                            <TableCell className="font-mono text-xs text-slate-400">
                                                {account.token ? `${account.token.substring(0, 8)}...` : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {account.status === "Connected" ?
                                                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 gap-1 font-normal">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        {account.status}
                                                    </Badge>
                                                    : <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100 gap-1 font-normal">
                                                        <XCircle className="w-3 h-3" />
                                                        {account.status}
                                                    </Badge>
                                                }
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-slate-900">฿{account.balance.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="hover:text-red-600 hover:bg-red-50">
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>

    )
}