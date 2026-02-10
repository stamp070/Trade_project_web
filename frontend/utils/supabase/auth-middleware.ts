// frontend/utils/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 1. ดึง User
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const path = request.nextUrl.pathname

    // 2. กฎสำหรับคน "ยังไม่ Login" (!user)
    if (
        !user &&
        !path.startsWith('/login') &&
        !path.startsWith('/auth') &&
        !path.startsWith('/register') &&
        path !== '/'
    ) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // 3. (เพิ่ม) กฎสำหรับคน "Login แล้ว" (user)
    if (user) {
        // ห้ามกลับไปหน้า Login/Register อีก
        if (path.startsWith('/login') || path.startsWith('/register')) {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }

        // (เพิ่ม) เช็ค Admin Zone
        if (path.startsWith('/admin')) {
            const role = user.user_metadata?.role
            if (role !== 'admin') {
                const url = request.nextUrl.clone()
                url.pathname = '/dashboard' // ดีดกลับ Dashboard ถ้าไม่ใช่ Admin
                return NextResponse.redirect(url)
            }
        }
    }

    return supabaseResponse
}