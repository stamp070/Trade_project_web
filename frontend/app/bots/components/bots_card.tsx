"use client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import BotsModal from "./bots_modal"
import { BotOption } from "@/types/bot"
import { createBot } from "@/services/bot"
import { useAuth } from "@/components/provider/auth-provider"
import { BotCreate } from "@/types/bot"
import { showToast } from "@/lib/toast-style"

interface BotsCardProps {
    name: string
    winRate: number
    maxDd: number
    timeframe: string
    lastUpdate: string
    versions: BotOption[]
    accounts: BotOption[]
}

export default function BotsCard({
    name,
    winRate,
    maxDd,
    timeframe,
    lastUpdate,
    versions,
    accounts
}: BotsCardProps) {
    const [open, setOpen] = useState(false)
    const { session } = useAuth()
    const token = session?.access_token

    const handleConnect = () => {
        setOpen(true)
    }


    return (
        <div className="w-full max-w-md mx-auto">
            <Card className="flex flex-col h-full border-none shadow-sm bg-white">
                <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl font-bold text-slate-900">{name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-6 pt-4">
                    <div className="flex gap-4">
                        <div className="flex-1 border rounded-lg p-3 text-center">
                            <div className="text-xs font-semibold text-slate-500 uppercase mb-1">WINRATE</div>
                            <div className="text-2xl font-bold text-slate-900">{winRate} %</div>
                        </div>
                        <div className="flex-1 border rounded-lg p-3 text-center">
                            <div className="text-xs font-semibold text-slate-500 uppercase mb-1">Max DD.</div>
                            <div className="text-2xl font-bold text-slate-900">{maxDd} %</div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Timeframe</span>
                            <span className="font-medium text-slate-900">{timeframe}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Last Update</span>
                            <span className="font-medium text-slate-900">{lastUpdate}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-2">
                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium h-11"
                        onClick={handleConnect}
                    >
                        Connect to MT5
                    </Button>
                </CardFooter>
            </Card>
            {open && (
                <BotsModal
                    name={name}
                    isOpen={open}
                    onClose={() => setOpen(false)}
                    versions={versions}
                    accounts={accounts}
                    onConfirm={(versionId, accountId) => {
                        console.log('Selected:', versionId, accountId);
                        const json: BotCreate = {
                            "version_id": versionId,
                            "mt5_id": accountId,
                            "currency": name
                        }
                        const addBot = async () => {
                            const data = await createBot(token || "", json)
                            if (data.status === "success") {
                                showToast.success('Bot added successfully!')

                            } else if (data.status === "bot already exist") {
                                showToast.warning('Bot already exist')
                            }
                            else {
                                showToast.error("Failed to add bot")
                            }
                        }
                        addBot()

                    }}
                />
            )}
        </div>
    )
}