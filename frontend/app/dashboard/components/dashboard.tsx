"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EquityChart } from '@/components/chart/equity-chart'
import PnlChart from '@/components/chart/pnl-chart'
import { useAuth } from "@/components/provider/auth-provider"
import { DeleteAccountButton } from "./delete-account-button"
import { useDashboard } from "../context/dashboard-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, CheckCircle2, XCircle } from "lucide-react"


export default function Dashboard() {
    const { session, isLoading: isAuthLoading } = useAuth()
    const { dashboardData, isLoading, fetchData } = useDashboard()

    if (isLoading) {
        return (
            <div className="space-y-6 p-6 min-h-screen">
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
                </Card >

                <Card className="shadow-sm border-none bg-white">
                    <CardHeader>
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div >
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
                <p className="text-slate-500">Welcome back, here's what's happening with your portfolio today.</p>
            </div>

            <Card className="border-none shadow-sm bg-white overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col xl:flex-row gap-6">
                        <div className="flex-1 min-w-0 ">
                            <EquityChart data={dashboardData?.pnl_graph || []} />
                        </div>
                        <div className="flex-1 min-w-0 xl:max-w-md ">
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <Card className="flex flex-col items-center justify-center p-4 shadow-sm border-none bg-white">
                                    <div className="text-lg font-semibold mb-1 text-center text-slate-700">Account Balance</div>
                                    <div className="text-4xl font-bold text-slate-900 mt-4">${Math.floor(dashboardData?.balance || 0).toLocaleString()}</div>
                                    <div className="text-xs text-slate-400 mt-1">Total Assets</div>
                                </Card>
                                <Card className="flex flex-col items-center justify-center p-4 shadow-sm border-none bg-white">
                                    <div className="text-lg font-semibold mb-1 text-center text-slate-700">Current Active Bots</div>
                                    <div className="text-4xl font-bold text-slate-900 mt-4">{dashboardData?.accounts.length || 0}</div>
                                    <div className="text-xs text-slate-400 mt-1">Bots</div>
                                </Card>
                            </div>
                            <PnlChart data={dashboardData?.pnl_circle || []} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-8 pt-8 border-t border-slate-100">
                        <div className="text-center">
                            <p className="text-xs text-slate-500 mb-1">Balance</p>
                            <div className="flex items-baseline justify-center gap-2">
                                <span className="text-3xl font-bold text-slate-900">${Math.floor(dashboardData?.balance || 0).toLocaleString()}</span>
                                <span className="text-sm font-medium text-emerald-500">({dashboardData?.total_pnl || 0 > 0 ? "+" : ""} ${dashboardData?.total_pnl || 0})</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 mb-1">Total Orders</p>
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

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-slate-800">Your Accounts</CardTitle>
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
                                    {dashboardData?.accounts.map((account, index) => (
                                        <TableRow key={index} className="hover:bg-slate-50">
                                            <TableCell className="font-medium text-slate-900">{account.account_name}</TableCell>
                                            <TableCell className="text-slate-500">{account.mt5_name}</TableCell>
                                            <TableCell className="font-mono text-xs text-slate-400">
                                                {account.token ? `${account.token}` : '-'}
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
                                            <TableCell className="text-right font-bold text-slate-900">${account.balance.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <DeleteAccountButton
                                                    token={session?.access_token || ""}
                                                    accountId={account.mt5_id}
                                                    accountName={account.account_name}
                                                    onSuccess={fetchData}
                                                >
                                                    <Button variant="ghost" size="icon" className="hover:text-red-600 cursor-pointer">
                                                        <Trash2 className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </DeleteAccountButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {(!dashboardData?.accounts || dashboardData.accounts.length === 0) && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                                No accounts found. Create one to get started.
                                            </td>
                                        </tr>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}