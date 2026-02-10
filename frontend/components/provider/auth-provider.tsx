"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User, Session } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/client" // ต้องมั่นใจว่ามีไฟล์ client นี้
import { useRouter } from "next/navigation"

// สร้าง Interface สำหรับ Context
interface AuthContextType {
    user: User | null
    session: Session | null
    isAdmin: boolean
    isLoading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()

                setSession(session)
                setUser(session?.user ?? null)

                // เช็ค Admin จาก Metadata
                if (session?.user?.user_metadata?.role === 'admin') {
                    setIsAdmin(true)
                } else {
                    setIsAdmin(false)
                }

            } catch (error) {
                console.error("Auth error:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchSession()

        // ฟัง Event เมื่อมีการ Login/Logout
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)

            if (session?.user?.user_metadata?.role === 'admin') {
                setIsAdmin(true)
            } else {
                setIsAdmin(false)
            }

            setIsLoading(false)

            if (_event === 'SIGNED_OUT') {
                setIsAdmin(false)
                router.push('/login')
            }
        })

        return () => subscription.unsubscribe()
    }, [supabase, router])

    const signOut = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <AuthContext.Provider value={{ user, session, isAdmin, isLoading, signOut }}>
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