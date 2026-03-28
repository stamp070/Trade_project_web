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

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "-"
        const d = new Date(dateStr)
        const day = String(d.getDate()).padStart(2, '0')
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const year = d.getFullYear()
        return `${day} / ${month} / ${year}`
    }

    useEffect(() => {
        if (isAuthLoading) return
        try {
            const fetchBot = async () => {
                const data = await getBot(session?.access_token || "")
                setBotOptions(data)
            }
            fetchBot()
        } catch (error) {
            console.error("Error fetching bots:", error)
        } finally {
            setIsLoading(false)
        }
    }, [session, isAuthLoading])

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

    const bots = botOptions?.bots_version || []
    console.log(bots)
    return (
        <div>
            <div className='max-w-6xl mx-auto px-6 py-12'>
                <h1 className='text-3xl font-bold mb-2 text-center' id="tour-bots-header">Choose Your Trading Bot</h1>
                <p className='text-slate-500 mb-8 text-center'>Select and connect your bots to MT5 accounts</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bots.map((bot, index) => {
                        const filteredVersions = (botOptions?.bots_version || []).filter(v =>
                            v.label.toUpperCase().includes(bot.label.toUpperCase())
                        )
                        return (
                            <div key={bot.id} id={`tour-bot-card-${index}`}>
                                <BotsCard
                                    name={bot.label}
                                    winRate={bot.win_rate ?? 0}
                                    maxDd={bot.max_drawdown ?? 0}
                                    timeframe="1 Hr."
                                    lastUpdate={formatDate(bot.update_at)}
                                    versions={filteredVersions}
                                    accounts={botOptions?.mt5_accounts || []}
                                />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}