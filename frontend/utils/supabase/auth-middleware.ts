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
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 1. ดึง User — MUST be called first to refresh session cookies
    const { data: { user } } = await supabase.auth.getUser()
    const path = request.nextUrl.pathname

    // 2. ถ้ายังไม่ได้ login → redirect ไป /login (ยกเว้นหน้า public)
    if (
        !user &&
        !path.startsWith('/login') &&
        !path.startsWith('/auth') &&
        !path.startsWith('/register') &&
        !path.startsWith('/callback') &&
        path !== '/'
    ) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // 3. ถ้า login แล้ว → เช็คเพิ่มเติม
    if (user) {
        // ห้ามกลับไปหน้า Login/Register
        if (path.startsWith('/login') || path.startsWith('/register')) {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }

        // เช็ค banned และ admin เฉพาะตอนที่จำเป็น (ประหยัด DB calls)
        if (path.startsWith('/admin') || !path.startsWith('/api')) {
            const { data: profile } = await supabase
                .from("profile")
                .select("role, account_status")
                .eq("user_id", user.id)
                .single()

            // คนโดนแบน → ดีดออก
            if (profile?.account_status === "banned") {
                if (path !== '/' && !path.startsWith('/login')) {
                    const url = request.nextUrl.clone()
                    url.pathname = '/'
                    url.searchParams.set('error', 'banned')
                    return NextResponse.redirect(url)
                }
            }

            // ป้องกัน Admin Zone
            if (path.startsWith('/admin') && profile?.role !== 'admin') {
                const url = request.nextUrl.clone()
                url.pathname = '/dashboard'
                return NextResponse.redirect(url)
            }
        }
    }

    return supabaseResponse
}