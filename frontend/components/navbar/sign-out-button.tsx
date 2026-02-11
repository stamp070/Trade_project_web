"use client"
import { useAuth } from "@/components/provider/auth-provider"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
    const { signOut } = useAuth()

    const handleSignOut = async () => {
        await signOut()
    }

    return (
        <Button variant="outline" onClick={handleSignOut} className="text-slate-600 hover:text-red-600">
            Sign Out
        </Button>
    )
}
