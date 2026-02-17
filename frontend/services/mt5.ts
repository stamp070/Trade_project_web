import { mt5_data, mt5_account } from "@/types/dashboard"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function createToken(token: string, tokenMt5: mt5_data): Promise<{ token: string, status: string } | null> {
    try {
        const res = await fetch(`${API_URL}/api/mt5/create-token`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(tokenMt5),
            cache: 'no-store'
        })
        if (!res.ok) {
            throw new Error(`Failed to fetch mt5 token: ${res.status}`)
        }
        return res.json()
    } catch (error) {
        console.error("Error fetching mt5 token:", error)
        return null
    }
}

export async function createAccount(token: string, accountMt5: mt5_account): Promise<{ token: string, status: string } | null> {
    try {
        const res = await fetch(`${API_URL}/api/mt5/create-account`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(accountMt5),
            cache: 'no-store'
        })
        if (!res.ok) {
            throw new Error(`Failed to fetch mt5 account: ${res.status}`)
        }
        return res.json()
    } catch (error) {
        console.error("Error fetching mt5 account:", error)
        return null
    }
}

export async function deleteAccount(token: string, MT5_id: string): Promise<{ status: string } | null> {
    try {
        const res = await fetch(`${API_URL}/api/mt5/delete-account/${MT5_id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store'
        })
        if (!res.ok) {
            throw new Error(`Failed to fetch mt5 account: ${res.status}`)
        }
        return res.json()
    } catch (error) {
        console.error("Error fetching mt5 account:", error)
        return null
    }
}
