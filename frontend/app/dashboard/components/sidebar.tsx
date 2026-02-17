"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Mt5Modal from './mt5-modal'
import { Skeleton } from "@/components/ui/skeleton"
import { useDashboard } from '../context/dashboard-context'

export default function Sidebar() {
    const pathname = usePathname()
    const { dashboardData, isLoading, fetchData } = useDashboard()
    const [mt5modal, setMt5modal] = useState(false)

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6 p-4">
                <Skeleton className="h-12 w-full rounded-full" />
                <Card className="bg-blue-50/50 border-none shadow-none">
                    <CardHeader className="pb-2">
                        <Skeleton className="h-4 w-32" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-5 w-24" />
                        </div>
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-3 w-20" />
                            <Skeleton className="h-5 w-24" />
                        </div>
                    </CardContent>
                </Card>
                <div className="space-y-3">
                    <Skeleton className="h-4 w-24 px-1" />
                    <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-10 w-full rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-6 p-4'>
            <Button variant="outline" className="w-full justify-between h-12 rounded-full border-gray-200 hover:bg-gray-50 hover:text-gray-900" onClick={() => setMt5modal(true)}>
                <span className="text-base font-normal">MT 5 Account</span>
                <Plus className="h-5 w-5 text-gray-500" />
            </Button>
            <Mt5Modal isOpen={mt5modal} onOpenChange={setMt5modal} onSuccess={() => fetchData()} />

            <Card className="bg-blue-50/50 border-none shadow-none">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-slate-700">Portfolio Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Total Balance</span>
                        <span className="font-bold text-slate-900">฿{dashboardData?.balance?.toLocaleString() ?? '0'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Total P&L</span>
                        <span className={`font-bold ${dashboardData?.total_pnl && dashboardData.total_pnl >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                            {dashboardData?.total_pnl && dashboardData.total_pnl > 0 ? "+" : ""}฿{dashboardData?.total_pnl?.toLocaleString() ?? '0'}
                        </span>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-3">
                <h3 className="font-semibold text-slate-700 px-1">MT5 Accounts</h3>
                <div className="space-y-2">
                    <Link href="/dashboard">
                        <div className={`flex justify-between items-center p-3 rounded-lg cursor-pointer ${pathname === '/dashboard' ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}>
                            <span className={`text-sm font-semibold ${pathname === '/dashboard' ? 'text-slate-900' : 'text-slate-600'}`}>Overall</span>
                        </div>
                    </Link>
                    {dashboardData?.accounts.map((account) => {
                        const isActive = pathname === `/dashboard/${account.mt5_id}`
                        return (
                            <Link key={account.mt5_id} href={`/dashboard/${account.mt5_id}`}>
                                <div
                                    className={`flex flex-col gap-1 p-3 rounded-lg cursor-pointer transition-colors ${isActive ? 'bg-blue-50/50 border-blue-100' : 'hover:bg-slate-50'}`}
                                >
                                    <div className="flex justify-between items-center w-full">
                                        <span className={`text-sm font-semibold ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                                            {account.account_name}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                    {(!dashboardData?.accounts || dashboardData.accounts.length === 0) && (
                        <div className="p-4 text-center text-sm text-slate-400 border border-dashed rounded-lg">
                            No accounts connected
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}