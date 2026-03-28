import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { unbanned_user } from "@/services/admin"
import { useAuth } from "@/components/provider/auth-provider"
import { showToast } from "@/lib/toast-style"
interface UnbannedModalProps {
    user_id: string
    onUnbanned: () => void
    children: React.ReactNode
}

export function UnbannedModal({ user_id, onUnbanned, children }: UnbannedModalProps) {
    const { session } = useAuth()
    const handleUnbanned = async () => {
        const res = await unbanned_user(session?.access_token || "", user_id)
        if (res?.status === "success") {
            onUnbanned()
            showToast.success(res?.message || "User unbanned successfully")
        } else {
            showToast.error(res?.message || "Failed to unban user")
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
                        Are you sure you want to unbanned this user?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-green-600 hover:bg-green-700" onClick={handleUnbanned}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}