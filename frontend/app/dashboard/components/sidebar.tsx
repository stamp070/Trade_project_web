"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import Mt5Modal from './mt5-modal'

// Mock Data Structure
const portfolioSummary = {
    totalBalance: 25847.32,
    totalPnl: 1247.85,
    todaysPnl: 324.12,
}

const accounts = [
    { id: "5044110616", name: "Main Account", balance: "17,248" },
    { id: "5044110617", name: "Secondary Account", balance: "8,599.32" },
]

export default function Sidebar() {
    const pathname = usePathname()
    const [mt5modal, setMt5modal] = useState(false)

    return (
        <div className='flex flex-col gap-6 p-4 '>
            <Button variant="outline" className="w-full justify-between h-12 rounded-full border-gray-200 hover:bg-gray-50 hover:text-gray-900">
                <span className="text-base font-normal">MT 5 Account</span>
                <Plus className="h-5 w-5 text-gray-500" />
            </Button>
            {mt5modal &&
                <Mt5Modal open={mt5modal} onOpenChange={setMt5modal} />
            }

            <Card className="bg-blue-50/50 border-none shadow-none">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-slate-700">Portfolio Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Total Balance</span>
                        <span className="font-bold text-slate-900">฿{portfolioSummary.totalBalance.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Total P&L</span>
                        <span className="font-bold text-emerald-600">+฿{portfolioSummary.totalPnl.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Today's P&L</span>
                        <span className="font-bold text-emerald-600">+฿{portfolioSummary.todaysPnl.toLocaleString()}</span>
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
                    {accounts.map((account) => {
                        const isActive = pathname === `/dashboard/${account.id}`
                        return (
                            <Link key={account.id} href={`/dashboard/${account.id}`}>
                                <div
                                    className={`flex justify-between items-center p-3 rounded-lg cursor-pointer ${isActive ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                                >
                                    <span className={`text-sm font-semibold ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                                        {account.name}
                                    </span>
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}