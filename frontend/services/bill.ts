
import { Invoice, CheckoutRequest } from "@/types/bill"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function getUserInvoices(token: string, userId: string): Promise<Invoice[] | null> {
    try {
        const res = await fetch(`${API_URL}/api/payment/get-invoice/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: 'no-store'
        })

        if (!res.ok) {
            throw new Error(`Failed to fetch invoices: ${res.status}`)
        }

        return res.json()
    } catch (error) {
        console.error("Error fetching invoices:", error)
        return null
    }
}

export async function getStripe(request: CheckoutRequest, token: string): Promise<{ url: string } | null> {
    try {
        console.log("request", request)
        const res = await fetch(`${API_URL}/api/payment/create-checkout-session`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
            cache: 'no-store'
        })
        if (!res.ok) {
            throw new Error(`Failed to fetch stripe url: ${res.status}`)
        }
        return res.json()
    } catch (error) {
        console.error("Error fetching stripe url:", error)
        return null
    }
}