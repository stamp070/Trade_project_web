import { BotData, BotCreate } from "@/types/bot"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function getBot(token: String): Promise<BotData | null> {
    try {
        const res = await fetch(`${API_URL}/api/bots/getbot`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store'
        })
        if (!res.ok) {
            throw new Error(`Failed to get bot: ${res.status}`)
        }
        const data = await res.json()
        return data
    } catch (error) {
        console.error("Error getting bot:", error)
        return null
    }
}

export async function createBot(token: String, request: BotCreate): Promise<any> {
    try {
        const res = await fetch(`${API_URL}/api/bots/createbot`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
            cache: 'no-store'
        })
        console.log(res)
        if (!res.ok) {
            throw new Error(`Failed to create bot: ${res.status}`)
        }
        return res.json()

    } catch (error) {
        console.error("Error creating bot:", error)
        return null
    }

}

