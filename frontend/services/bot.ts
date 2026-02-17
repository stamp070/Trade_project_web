import { BotData, BotCreate, Bot } from "@/types/bot"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export async function updateBotStatus(token: string, bot_id: string, connection: string): Promise<Bot[] | null> {
    try {
        const res = await fetch(`${API_URL}/api/bots/${bot_id}/${connection}`, {
            method: "POST",
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
        console.error("Error updating bot status:", error)
        return null
    }
}

export async function getBot(token: String): Promise<BotData | null> {
    try {
        const res = await fetch(`${API_URL}/api/bots/get-bot`, {
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
        const res = await fetch(`${API_URL}/api/bots/create-bot`, {
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

export async function deleteBot(token: String, bot_id: string): Promise<any> {
    try {
        const res = await fetch(`${API_URL}/api/bots/delete-bot/${bot_id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            cache: 'no-store'
        })
        if (!res.ok) {
            throw new Error(`Failed to delete bot: ${res.status}`)
        }
        return res.json()
    } catch (error) {
        console.error("Error deleting bot:", error)
        return null
    }
}

