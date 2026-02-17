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

interface DeleteBotButtonProps {
    token: string
    botId: string
    botName: string
    onSuccess?: () => void
    children?: React.ReactNode
}

export function DeleteBotButton({ token, botId, botName, onSuccess }: DeleteBotButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    // const handleDelete = async () => {
    //     setIsDeleting(true)
    //     try {
    //         const result = await deleteBot(token, botId)
    //         if (result && result.status === "success") {
    //             toast.success("Bot deleted", {
    //                 description: `Bot ${botName} has been successfully deleted.`,
    //             })
    //             if (onSuccess) {
    //                 onSuccess()
    //             }
    //         } else {
    //             toast.error("Error", {
    //                 description: "Failed to delete bot. Please try again.",
    //             })
    //         }
    //     } catch (error) {
    //         console.error("Error deleting bot:", error)
    //         toast.error("Error", {
    //             description: "An unexpected error occurred.",
    //         })
    //     } finally {
    //         setIsDeleting(false)
    //     }
    // }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:text-red-600 cursor-pointer">
                    <Trash2 className="w-4 h-4 text-red-600" />
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
