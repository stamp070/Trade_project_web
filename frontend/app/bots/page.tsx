"use client"
import BotsCard from "./components/bots_card"
import { useAuth } from "@/components/provider/auth-provider"
import { useEffect, useState } from "react"
import { getBot } from "@/services/bot"
import { BotData } from "@/types/bot"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getDashboardAccounts } from "@/services/dashboard"


export default function Bots() {
    const [isLoading, setIsLoading] = useState(true)
    const { session, isLoading: isAuthLoading } = useAuth()
    const [botOptions, setBotOptions] = useState<BotData | null>(null)

    const availableBots = [
        { name: "EURUSD", winRate: 52, maxDd: -8.2, timeframe: "1 Hr.", lastUpdate: "22 / 12 / 2025" },
        { name: "JPYUSD", winRate: 52, maxDd: -8.2, timeframe: "1 Hr.", lastUpdate: "22 / 12 / 2025" },
        { name: "GBPUSD", winRate: 52, maxDd: -8.2, timeframe: "1 Hr.", lastUpdate: "22 / 12 / 2025" },
    ]

    useEffect(() => {
        try {
            const fetchBot = async () => {
                if (!session?.access_token) return
                const data = await getBot(session?.access_token)
                setBotOptions(data)
            }
            fetchBot()

        } catch (error) {
            console.error("Error fetching bots:", error)
        } finally {
            setIsLoading(false)
        }
    }, [session, isAuthLoading])
    console.log(session?.access_token)

    if (isLoading) {
        return <div className="p-12"><Skeleton className="h-[200px] w-full rounded-xl" /></div>
    }

    return (
        <div>
            <div className='max-w-6xl mx-auto px-6 py-12'>
                <h1 className='text-3xl font-bold mb-2 text-center'>Choose Your Trading Bot</h1>
                <p className='text-slate-500 mb-8 text-center'>Select and connect your bots to MT5 accounts</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {availableBots.map((bot, index) => (
                        <BotsCard
                            key={index}
                            name={bot.name}
                            winRate={bot.winRate}
                            maxDd={bot.maxDd}
                            timeframe={bot.timeframe}
                            lastUpdate={bot.lastUpdate}
                            versions={botOptions?.bots_version || []}
                            accounts={botOptions?.mt5_accounts || []}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}