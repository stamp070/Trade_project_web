"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { user_profile } from "@/types/admin"
import { useState, useEffect } from "react"
import { get_user_profile } from "@/services/admin"
import { useAuth } from "@/components/provider/auth-provider"
import { Wallet, Mail, LayoutDashboard, ReceiptText, Bot as BotIcon } from "lucide-react"

interface profileprob {
    user_id: string
    children: React.ReactNode
}

export function ProfileModal({ user_id, children }: profileprob) {
    const { session } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [profile, setProfile] = useState<user_profile | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const fetch_profile = async () => {
        setIsLoading(true)
        try {
            const res = await get_user_profile(session?.access_token || "", user_id)
            setProfile(res)
        } catch (error) {
            console.error("Failed to fetch profile:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!isOpen || !session?.access_token) return
        fetch_profile()
    }, [isOpen, session])

    const userEmail = profile?.profile?.[0]?.email || "Loading..."
    const userRole = profile?.profile?.[0]?.role || "Loading..."
    const totalBalance = profile?.balance ?? 0

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="!max-w-[90vw] sm:!max-w-[70vw] w-full h-[80vh] flex flex-col overflow-hidden bg-slate-50">
                <DialogHeader className="px-2 pb-4 border-b shrink-0">
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <LayoutDashboard className="w-6 h-6 text-indigo-600" />
                        User Profile Details
                    </DialogTitle>
                    <DialogDescription>
                        Comprehensive overview of user accounts, bots, and billing history.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-2 space-y-6">
                    {/* Top Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Contact Info</CardTitle>
                                <Mail className="w-4 h-4 text-slate-400" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{userEmail}</div>
                                <div className="text-sm text-slate-500 capitalize mt-1">Role: {userRole}</div>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-slate-500">Total MT5 Balance</CardTitle>
                                <Wallet className="w-4 h-4 text-emerald-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-emerald-600">
                                    ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className="text-sm text-slate-500 mt-1">Across all connected accounts</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs for Bots and Invoices */}
                    <Tabs defaultValue="bots" className="w-full">
                        <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
                            <TabsTrigger value="bots" className="flex items-center gap-2">
                                <BotIcon className="w-4 h-4" /> Trading Bots
                            </TabsTrigger>
                            <TabsTrigger value="invoices" className="flex items-center gap-2">
                                <ReceiptText className="w-4 h-4" /> Billing / Invoices
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="bots" className="bg-white rounded-xl border shadow-sm p-4">
                            <h3 className="text-lg font-semibold mb-4">Connected Bots & MT5</h3>
                            {isLoading ? (
                                <div className="text-center py-8 text-slate-500">Loading bots...</div>
                            ) : (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader className="bg-slate-50">
                                            <TableRow>
                                                <TableHead>No.</TableHead>
                                                <TableHead>MT5 Account</TableHead>
                                                <TableHead>Currency Pair</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {profile?.bots && profile.bots.length > 0 ? (
                                                profile.bots.map((bot, index) => {
                                                    // Handle nested mt5_name if present from Supabase join
                                                    const mt5Name = (bot.mt5_accounts as any)?.mt5_name || "Unknown"
                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell className="font-medium">{mt5Name}</TableCell>
                                                            <TableCell>{bot.currency || "-"}</TableCell>
                                                            <TableCell>
                                                                <Badge variant="secondary" className={`${bot.connection === 'Connected' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'} font-normal`}>
                                                                    {bot.connection || "Disconnected"}
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center h-24 text-slate-500">
                                                        No trading bots found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="invoices" className="bg-white rounded-xl border shadow-sm p-4">
                            <h3 className="text-lg font-semibold mb-4">Invoice History</h3>
                            {isLoading ? (
                                <div className="text-center py-8 text-slate-500">Loading invoices...</div>
                            ) : (
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader className="bg-slate-50">
                                            <TableRow>
                                                <TableHead>Date Issued</TableHead>
                                                <TableHead>Due Date</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {profile?.invoice && profile.invoice.length > 0 ? (
                                                profile.invoice.map((inv, index) => {
                                                    let statusColor = "bg-slate-100 text-slate-700"
                                                    if (inv.status === "paid") statusColor = "bg-emerald-100 text-emerald-700"
                                                    if (inv.status === "unpaid") statusColor = "bg-yellow-100 text-yellow-700"
                                                    if (inv.status === "overdue") statusColor = "bg-red-100 text-red-700"

                                                    return (
                                                        <TableRow key={index}>
                                                            <TableCell>{new Date(inv.created_at).toLocaleDateString('en-GB')}</TableCell>
                                                            <TableCell>{new Date(inv.due_date).toLocaleDateString('en-GB')}</TableCell>
                                                            <TableCell className="font-medium">${Number(inv.commission_amount).toFixed(2)}</TableCell>
                                                            <TableCell>
                                                                <Badge variant="secondary" className={`${statusColor} capitalize font-normal`}>
                                                                    {inv.status}
                                                                </Badge>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                })
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center h-24 text-slate-500">
                                                        No invoices found.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    )
}