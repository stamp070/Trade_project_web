"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/components/provider/auth-provider"
import { getUserInvoices, getStripe } from "@/services/bill"
import { Invoice } from "@/types/bill"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { CreditCard, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { NextResponse } from 'next/server'
import { CheckoutRequest } from "@/types/bill"


export default function BillsPage() {
    const { session, user } = useAuth()
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchBills = async () => {
            if (user?.id && session?.access_token) {
                const data = await getUserInvoices(session.access_token, user.id)
                if (data) setInvoices(data)
                setIsLoading(false)
            }
        }
        fetchBills()
    }, [user, session])

    const unpaidBills = invoices.filter(inv => inv.status === 'unpaid')
    const paidBills = invoices.filter(inv => inv.status === 'paid').sort((a, b) => new Date(b.paid_at || "").getTime() - new Date(a.paid_at || "").getTime())

    const totalUnpaid = unpaidBills.reduce((sum, bill) => sum + Number(bill.commission_amount), 0)

    const isPay = () => {
        const fetch = async () => {
            const invoice_ids = unpaidBills.map(bill => bill.invoice_id)
            const url = await getStripe({ invoice_ids } as CheckoutRequest, session?.access_token || "")
            if (url) {
                window.location.href = url.url
            }
            console.log(url)
        }
        fetch()
    }

    if (isLoading) {
        return (
            <div className="max-w-5xl mx-auto p-6 space-y-8 min-h-screen">
                <Skeleton className="h-[250px] w-full rounded-xl" />
                <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
        )
    }

    return (
        <div className="bg-slate-50/50 min-h-screen">
            <div className="max-w-5xl mx-auto p-6 space-y-8">

                {/* --- Current Bill Section --- */}
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="border-b bg-white pb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-2xl font-bold text-slate-900">Current Bill</CardTitle>
                                <p className="text-slate-500 mt-1">Performance-based trading fees</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-emerald-600">
                                    $ {totalUnpaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className="text-sm text-slate-400 mt-1">Total Amount</div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {unpaidBills.length > 0 ? (
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1 w-full">
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Bills</p>
                                        <p className="font-medium text-slate-900">{unpaidBills.length}</p>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <p className="text-xs text-red-500 uppercase font-semibold mb-1">Due Date</p>
                                        <p className="font-medium text-red-700">{new Date(unpaidBills[0].due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-lg">
                                        <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Fee Percentage</p>
                                        <p className="font-medium text-slate-900">{(unpaidBills[0].commission_rate * 100).toFixed(0)} %</p>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <p className="text-xs text-yellow-600 uppercase font-semibold mb-1">Status</p>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-yellow-600" />
                                            <span className="font-medium text-yellow-700 capitalize">unpaid</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full md:w-auto">
                                    <Button size="lg" className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 min-w-[140px] h-12 text-base" onClick={isPay}>
                                        <CreditCard className="w-4 h-4 mr-2" />
                                        Pay Now
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                                <CheckCircle className="w-12 h-12 text-emerald-500 mb-3" />
                                <p className="text-lg font-medium text-slate-900">All caught up!</p>
                                <p className="text-sm">You have no pending bills at the moment.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* --- Payment History Section --- */}
                <Card className="border-none shadow-sm bg-white">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-slate-900">Payment History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent border-b-slate-100">
                                    <TableHead className="w-[200px] font-semibold text-slate-500">Bills_id</TableHead>
                                    <TableHead className="font-semibold text-slate-500">Date</TableHead>
                                    <TableHead className="font-semibold text-slate-500">Status</TableHead>
                                    <TableHead className="text-right font-semibold text-slate-500">Amount</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paidBills.length > 0 ? (
                                    paidBills.map((bill) => (
                                        <TableRow key={bill.invoice_id} className="hover:bg-slate-50 border-b-slate-50">
                                            <TableCell className="font-medium text-slate-700">
                                                {bill.invoice_id.toUpperCase()}
                                            </TableCell>
                                            <TableCell className="text-slate-600">
                                                {bill.paid_at ? new Date(bill.paid_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none font-normal">
                                                    Paid
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-slate-900">
                                                $ {bill.commission_amount.toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-slate-500">
                                            No payment history found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
