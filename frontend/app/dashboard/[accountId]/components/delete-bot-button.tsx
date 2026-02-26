"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { deleteBot } from "@/services/bot"
import { showToast } from "@/lib/toast-style"

interface DeleteBotButtonProps {
    token: string
    botId: string
    botName: string
    disabled?: boolean
    onSuccess?: () => void
    children?: React.ReactNode
}

export function DeleteBotButton({ token, botId, botName, disabled, onSuccess }: DeleteBotButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deleteBot(token, botId)
            if (result && result.status === "success") {
                showToast.success('Bot deleted successfully!')
                if (onSuccess) {
                    onSuccess()
                }
            } else {
                showToast.error("Failed to delete bot")
            }
        } catch (error) {
            console.error("Error deleting bot:", error)
            showToast.error("Failed to delete bot")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" disabled={disabled} className={`cursor-pointer ${disabled ? 'text-slate-400' : 'hover:text-red-600'}`}>
                    <Trash2 className={`w-4 h-4 ${disabled ? 'text-slate-400' : 'text-red-600'}`} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete your bot
                        <span className="font-bold text-foreground"> {botName} </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault()
                            handleDelete()
                        }}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isDeleting ? "Deleting..." : "Delete Bot"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
