"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "@/components/provider/auth-provider"
import { getDashboardOverview } from "@/services/dashboard"
import { DashboardData } from "@/types/dashboard"

interface DashboardContextType {
    dashboardData: DashboardData | null
    isLoading: boolean
    fetchData: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
    const { session, isLoading: isAuthLoading } = useAuth()
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchData = async () => {
        if (!session?.access_token) return
        try {
            const data = await getDashboardOverview(session.access_token)
            setDashboardData(data)
        } catch (error) {
            console.error("Error fetching dashboard overview:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!isAuthLoading) {
            fetchData()
        }
    }, [session, isAuthLoading])

    return (
        <DashboardContext.Provider value={{ dashboardData, isLoading, fetchData }}>
            {children}
        </DashboardContext.Provider>
    )
}

export function useDashboard() {
    const context = useContext(DashboardContext)
    if (context === undefined) {
        throw new Error("useDashboard must be used within a DashboardProvider")
    }
    return context
}
