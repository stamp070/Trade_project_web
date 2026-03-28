"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { User, Session } from "@supabase/supabase-js"
import { createClient } from "@/utils/supabase/client" // ต้องมั่นใจว่ามีไฟล์ client นี้
import { useRouter } from "next/navigation"
import { serverSignOut } from "@/services/auth"
import { showToast } from "@/lib/toast-style"

// สร้าง Interface สำหรับ Context
interface AuthContextType {
    user: User | null
    role: string | null
    session: Session | null
    isAdmin: boolean
    isLoading: boolean
    tourState: Record<string, boolean>
    updateTourState: (tourId: string) => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [session, setSession] = useState<Session | null>(null)
    const [role, setRole] = useState<string | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [tourState, setTourState] = useState<Record<string, boolean>>({})

    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        let isMounted = true

        const fetchRole = async (userID: string) => {
            try {
                if (!userID) return
                const { data, error } = await supabase
                    .from("profile")
                    .select("role")
                    .eq("user_id", userID)
                    .single()

                if (error) {
                    console.error("Error fetching profile from DB:", error.message)
                    return
                }

                if (!isMounted) return

                setRole(data?.role)
                if (data?.role === 'admin') {
                    setIsAdmin(true)
                } else {
                    setIsAdmin(false)
                }

                // แยกร้องขอ tour_state แบบ safe (ป้องกันแอปพังถ้ายังไม่ได้เพิ่ม column ใน DB)
                const tourRes = await supabase
                    .from("profile")
                    .select("tour_state")
                    .eq("user_id", userID)
                    .single()

                setTourState(tourRes?.data?.tour_state || {})

            } catch (error) {
                console.error("Auth error:", error)
            }
        }

        const initializeAuth = async () => {
            try {
                // ใช้ getUser() ดึงข้อมูลที่ชัวร์ที่สุดจาก Server ก่อนเพื่อป้องกัน RLS token ว่างเปล่าตอน Refresh
                const { data: { user } } = await supabase.auth.getUser()
                const { data: { session } } = await supabase.auth.getSession()

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
                    setTourState({})
                }
            } catch (error) {
                console.error("Auth error:", error)
            } finally {
                if (isMounted) setIsLoading(false)
            }
        }

        initializeAuth()

        // ฟัง Event เมื่อมีการ Login/Logout
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            if (!isMounted) return

            // ข้าม INITIAL_SESSION เพราะเราให้ initializeAuth ดึงชัวร์ๆ ผ่าน getUser ไปแล้ว
            if (_event === 'INITIAL_SESSION') return

            setSession(newSession)
            setUser(newSession?.user ?? null)

            if (newSession?.user) {
                await fetchRole(newSession.user.id)
            } else {
                setRole(null)
                setIsAdmin(false)
                setTourState({})
            }

            setIsLoading(false)

            if (_event === 'SIGNED_OUT') {
                router.push('/')
                router.refresh()
            }
        })

        return () => {
            isMounted = false
            subscription.unsubscribe()
        }
    }, [supabase, router])

    const updateTourState = async (tourId: string) => {
        if (!user) return

        const newState = { ...tourState, [tourId]: true }
        setTourState(newState)

        console.log("Preparing to send to Supabase:", newState)
        supabase.from("profile")
            .update({ tour_state: newState })
            .eq("user_id", user.id)
            .then(({ error }) => {
                if (error) console.error("Error updating tour:", error)
            })
    }

    const signOut = async () => {
        router.push('/')
        router.refresh()

        try {
            await serverSignOut()
            showToast.success("Sign out successfully")
        } catch (error) {
            showToast.error("Error signing out")
        }
        await supabase.auth.signOut()

        setSession(null)
        setUser(null)
        setRole(null)
        setIsAdmin(false)
    }

    return (
        <AuthContext.Provider value={{ user, role, session, isAdmin, isLoading, tourState, updateTourState, signOut }}>
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