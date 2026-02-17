"use client"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { SquareUser, CircleDollarSign, ChartCandlestick } from "lucide-react"
import { useEffect, useState } from "react"
import { get_admin_top_dashboard } from "@/services/admin"
import { total } from "@/types/admin"
import { useAuth } from "@/components/provider/auth-provider"
import { Skeleton } from "@/components/ui/skeleton"


export default function TopDashboard() {
    const { session, user } = useAuth()
    const [admin_dashboard, setAdminDashboard] = useState<total | null>(null)
    const [isloading, setIsloading] = useState(true)
    useEffect(() => {
        const fetchAdminDashboard = async () => {
            try {
                const data = await get_admin_top_dashboard(session?.access_token || "")
                setAdminDashboard(data)
            } catch (error) {
                console.error("Error fetching admin dashboard data:", error)
            } finally {
                setIsloading(false)
            }
        }
        fetchAdminDashboard()
    }, [session])

    if (isloading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <Card className="w-full">
                    <CardHeader>
                        <Skeleton className="size-12 rounded-lg" />
                        <Skeleton className="h-10" />
                        <Skeleton className="h-10" />
                    </CardHeader>

                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="size-10 rounded-lg" />
                        <Skeleton className="h-10" />
                        <Skeleton className="h-10" />
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="size-10 rounded-lg" />
                        <Skeleton className="h-10" />
                        <Skeleton className="h-10" />
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <Card className="w-full">
                <CardHeader>
                    <div className="bg-blue-600/10 w-fit p-1 rounded-lg mb-2">
                        <SquareUser className="w-10 h-10 text-blue-600" />
                    </div>
                    <CardDescription className="text-3xl font-bold text-black-600">{admin_dashboard?.total_user}</CardDescription>
                </CardHeader>
                <CardContent>
                    <CardDescription>Total users</CardDescription>
                </CardContent>
            </Card>
            <Card className="w-full">
                <CardHeader>
                    <div className="bg-emerald-600/10 w-fit p-1 rounded-lg mb-2">
                        <CircleDollarSign className="w-10 h-10 text-emerald-600" />
                    </div>
                    <CardDescription className="text-3xl font-bold text-black-600">{admin_dashboard?.total_commission}</CardDescription>
                </CardHeader>
                <CardContent>
                    <CardDescription>Total Commision</CardDescription>
                </CardContent>
            </Card>
            <Card className="w-full">
                <CardHeader>
                    <div className="bg-purple-600/10 w-fit p-1 rounded-lg mb-2">
                        <ChartCandlestick className="w-10 h-10 text-purple-600" />
                    </div>
                    <CardDescription className="text-3xl font-bold text-black-600">{admin_dashboard?.total_mt5}</CardDescription>
                </CardHeader>
                <CardContent>
                    <CardDescription>MT5 Accounts</CardDescription>
                </CardContent>
            </Card>
        </div>
    )
}