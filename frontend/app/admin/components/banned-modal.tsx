import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { banned_user } from "@/services/admin"
import { useAuth } from "@/components/provider/auth-provider"
import { showToast } from "@/lib/toast-style"

interface BannedModalProps {
    user_id: string
    onBanned: () => void
    children: React.ReactNode
}

export function BannedModal({ user_id, onBanned, children }: BannedModalProps) {
    const { session, user } = useAuth()
    const handleBanned = async () => {
        const res = await banned_user(session?.access_token || "", user_id)
        if (res?.status === "success") {
            onBanned()
            showToast.success(res?.message || "User banned successfully")
        } else {
            showToast.error(res?.message || "Failed to ban user")
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Banned User</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to banned this user?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleBanned}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}