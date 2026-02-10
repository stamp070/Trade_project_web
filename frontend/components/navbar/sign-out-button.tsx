"use client"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push("/")
    }

    return (
        <Button variant="outline" onClick={handleSignOut} className="text-slate-600 hover:text-red-600">
            Sign Out
        </Button>
    )
}
