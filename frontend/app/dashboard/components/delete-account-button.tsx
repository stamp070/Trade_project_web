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
import { deleteAccount } from "@/services/mt5"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

interface DeleteAccountButtonProps {
    token: string
    accountId: string
    accountName: string
    onSuccess?: () => void
    children?: React.ReactNode
}

export function DeleteAccountButton({ token, accountId, accountName, onSuccess }: DeleteAccountButtonProps) {
    const router = useRouter()
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const result = await deleteAccount(token, accountId)
            if (result && result.status === "success") {
                toast.success("Account deleted", {
                    description: `Account ${accountName} has been successfully deleted.`,
                })
                if (onSuccess) {
                    onSuccess()
                } else {
                    router.push("/dashboard")
                }
            } else {
                toast.error("Error", {
                    description: "Failed to delete account. Please try again.",
                })
            }
        } catch (error) {
            console.error("Error deleting account:", error)
            toast.error("Error", {
                description: "An unexpected error occurred.",
            })
        } finally {
            setIsDeleting(false)
        }
    }

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
                        This will permanently delete your account
                        <span className="font-bold text-foreground"> {accountName} </span>
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
                        {isDeleting ? "Deleting..." : "Delete Account"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
