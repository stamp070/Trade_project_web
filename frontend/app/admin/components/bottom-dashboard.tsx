"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash, Eye, BanIcon, CircleCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect } from "react"
import { get_admin_bottom_dashboard } from "@/services/admin"
import { User } from "@/types/admin"
import { useAuth } from "@/components/provider/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"
import { BannedModal } from "./banned-modal"
import { UnbannedModal } from "./unbanned-modal"


export default function BottomDashboard() {
    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState("All")
    const { session } = useAuth()
    const [admin_dashboard, setAdminDashboard] = useState<User[] | null>(null)
    const [isloading, setIsloading] = useState(true)

    const filteredUsers = admin_dashboard?.filter(user => {
        const matchesSearch = user.email.toLowerCase().includes(search.toLowerCase())
        // Derived status for filtering
        const latestInvoice = user.invoice && user.invoice.length > 0 ? user.invoice[user.invoice.length - 1] : null
        const status = latestInvoice ? latestInvoice.status : "No Invoice"

        const matchesFilter = filterStatus === "All" || status.toLowerCase() === filterStatus.toLowerCase()
        return matchesSearch && matchesFilter
    })

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "paid": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            case "unpaid": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
            case "overdue": return "bg-red-100 text-red-700 hover:bg-red-200"
            default: return "bg-slate-100 text-slate-700"
        }
    }

    const fetchAdminDashboard = async () => {
        try {
            const data = await get_admin_bottom_dashboard(session?.access_token || "")
            setAdminDashboard(data?.users || [])
        } catch (error) {
            console.error("Error fetching admin dashboard data:", error)
        } finally {
            setIsloading(false)
        }
    }

    useEffect(() => {
        fetchAdminDashboard()
    }, [session])

    if (isloading) {
        return (
            <div>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <Skeleton className="h-10 w-1/3" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-10 w-1/2" />
                    </CardContent>
                    <div className="flex flex-col w-full max-w-full gap-5 p-4">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div className="flex gap-4" key={index}>
                                <Skeleton className="h-6 w-2/4" />
                                <Skeleton className="h-6 w-1/4" />
                                <Skeleton className="h-6 w-1/4" />
                                <Skeleton className="h-6 w-1/4" />
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold">Admin Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-row justify-between mb-4 gap-4">
                        <Input
                            className="max-w-sm"
                            placeholder="Search user..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="justify-between min-w-[150px]">
                                    {filterStatus === "All" ? "Status" : filterStatus}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="">
                                <DropdownMenuLabel>Status</DropdownMenuLabel>
                                <DropdownMenuGroup>
                                    <DropdownMenuCheckboxItem
                                        checked={filterStatus === "All"}
                                        onCheckedChange={() => setFilterStatus("All")}
                                    >
                                        All
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={filterStatus === "Paid"}
                                        onCheckedChange={() => setFilterStatus("Paid")}
                                    >
                                        Paid
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={filterStatus === "Unpaid"}
                                        onCheckedChange={() => setFilterStatus("Unpaid")}
                                    >
                                        Unpaid
                                    </DropdownMenuCheckboxItem>
                                    <DropdownMenuCheckboxItem
                                        checked={filterStatus === "Overdue"}
                                        onCheckedChange={() => setFilterStatus("Overdue")}
                                    >
                                        Overdue
                                    </DropdownMenuCheckboxItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>MT5 Account</TableHead>
                                <TableHead>Current Bill</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Last Update</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers && filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => {
                                    const mt5Count = user.mt5_accounts ? user.mt5_accounts.length : 0
                                    const latestInvoice = user.invoice && user.invoice.length > 0 ? user.invoice[user.invoice.length - 1] : null
                                    const status = latestInvoice ? latestInvoice.status : "No Invoice"

                                    return (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{user.email}</TableCell>
                                            <TableCell>{mt5Count} Account{mt5Count !== 1 ? 's' : ''}</TableCell>
                                            <TableCell>
                                                <div className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold w-fit capitalize", getStatusColor(status))}>
                                                    {status}
                                                </div>
                                            </TableCell>
                                            <TableCell className="capitalize">{user.role}</TableCell>
                                            <TableCell>{new Date(user.updated_at).toLocaleDateString('en-GB')}</TableCell>
                                            <TableCell>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="icon" className="h-8 w-8">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {user.account_status !== "banned" ?
                                                        <BannedModal onBanned={fetchAdminDashboard} user_id={user.user_id}>
                                                            <Button variant="outline" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700">
                                                                <BanIcon className="h-4 w-4 text-red-600" />
                                                            </Button>
                                                        </BannedModal> :
                                                        <UnbannedModal onUnbanned={fetchAdminDashboard} user_id={user.user_id}>
                                                            <Button variant="outline" size="icon" className="h-8 w-8 text-green-500 hover:text-green-700">
                                                                <CircleCheck className="h-4 w-4 text-green-600" />
                                                            </Button>
                                                        </UnbannedModal>
                                                    }
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

        </div>
    )
}