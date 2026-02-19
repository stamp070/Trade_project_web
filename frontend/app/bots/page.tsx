"use client"
import BotsCard from "./components/bots_card"
import { useAuth } from "@/components/provider/auth-provider"
import { useEffect, useState } from "react"
import { getBot } from "@/services/bot"
import { BotData } from "@/types/bot"
import { Skeleton } from "@/components/ui/skeleton"


export default function Bots() {
    const { session, isLoading: isAuthLoading } = useAuth()
    const [botOptions, setBotOptions] = useState<BotData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

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
        return <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-4">
            <div className="flex flex-col gap-4 items-center">
                <Skeleton className="h-10 w-1/3 rounded-xl" />
                <Skeleton className="h-10 w-1/2 rounded-xl" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-80 max-w-md rounded-xl" />
                ))}
            </div>
        </div>
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