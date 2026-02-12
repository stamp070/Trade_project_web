import { DashboardData, DashboardAccountsData, Account } from "@/types/dashboard"


// Debugging helper
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function getDashboardOverview(token: string): Promise<DashboardData | null> {
    try {
        console.log(`Fetching dashboard from: ${API_URL}/api/overview`)

        const res = await fetch(`${API_URL}/api/overview`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store'
        })

        if (!res.ok) {
            console.error(`Status: ${res.status} ${res.statusText}`)
            const errorBody = await res.text()
            console.error("Error Body:", errorBody)
            throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`)
        }

        return res.json()
    } catch (error) {
        console.error("Error fetching dashboard overview data:", error)
        return null
    }
}

export async function getDashboardAccounts(token: string, account_id: string): Promise<DashboardAccountsData | null> {
    try {
        console.log(`Fetching dashboard from: ${API_URL}/api/account/${account_id}`)

        const res = await fetch(`${API_URL}/api/account/${account_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store'
        })

        if (!res.ok) {
            console.error(`Status: ${res.status} ${res.statusText}`)
            const errorBody = await res.text()
            console.error("Error Body:", errorBody)
            throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`)
        }

        return res.json()
    } catch (error) {
        console.error("Error fetching dashboard account data:", error)
        return null
    }
}