"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User, Session } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/client" // ต้องมั่นใจว่ามีไฟล์ client นี้
import { useRouter } from "next/navigation"

// สร้าง Interface สำหรับ Context
interface AuthContextType {
    user: User | null
    role: string | null
    session: Session | null
    isAdmin: boolean
    isLoading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [role, setRole] = useState<string | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        let isMounted = true

        const fetchSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()
                const { data: { user } } = await supabase.auth.getUser()

                if (!isMounted) return

                if (user && session) {
                    setSession(session)
                    setUser(user)
                    await fetchRole(user.id) // wait for role before showing app
                } else {
                    setSession(null)
                    setUser(null)
                    setRole(null)
                    setIsAdmin(false)
                }
            } catch (error) {
                console.error("Auth error:", error)
            } finally {
                if (isMounted) {
                    setIsLoading(false)
                }
            }
        }
        const fetchRole = async (userID: string) => {
            try {
                if (!userID) return
                console.log("this is user naja", userID)
                const { data, error } = await supabase
                    .from("profile")
                    .select("role") // ดึงมาแค่ role ก็พอครับเพื่อความไว
                    .eq("user_id", userID)
                    .single()

                if (error) {
                    console.error("Error fetching profile from DB:", error.message)
                    return
                }
                setRole(data?.role)

                // เช็ค Admin    
                if (data?.role === 'admin') {
                    setIsAdmin(true)
                } else {
                    setIsAdmin(false)
                }
            } catch (error) {
                console.error("Auth error:", error)
            }
        }

        fetchSession()

        // ฟัง Event เมื่อมีการ Login/Logout
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            if (!isMounted) return

            setSession(newSession)
            setUser(newSession?.user ?? null)

            if (newSession?.user) {
                await fetchRole(newSession.user.id)
            } else {
                setRole(null)
                setIsAdmin(false)
            }

            setIsLoading(false)

            if (_event === 'SIGNED_OUT') {
                router.push('/login')
            }
        })

        return () => {
            isMounted = false
            subscription.unsubscribe()
        }
    }, [supabase, router])

    const signOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <AuthContext.Provider value={{ user, role, session, isAdmin, isLoading, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom Hook ให้เรียกใช้ง่ายๆ
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}