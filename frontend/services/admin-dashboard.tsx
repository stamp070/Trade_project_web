import { total, User } from "@/types/admin-dashboard"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function get_admin_top_dashboard(token: string): Promise<total | null> {
    try {
        const res = await fetch(`${API_URL}/api/admin/top-admin`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store"
        })
        if (!res.ok) {
            throw new Error("Failed to fetch admin dashboard data")
        }
        return res.json()
    } catch (error) {
        console.error("Error fetching admin dashboard data:", error)
        return null
    }
}
export async function get_admin_bottom_dashboard(token: string): Promise<User[] | null> {
    try {
        const res = await fetch(`${API_URL}/api/admin/bottom-admin`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: "no-store"
        })
        if (!res.ok) {
            throw new Error("Failed to fetch admin dashboard data")
        }
        return res.json()
    } catch (error) {
        console.error("Error fetching admin dashboard data:", error)
        return null
    }
}