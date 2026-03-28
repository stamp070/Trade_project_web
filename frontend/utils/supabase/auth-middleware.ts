// frontend/utils/supabase/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return request.cookies.getAll() },
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

    // MUST call getUser() first — refreshes token and sets new cookies
    const { data: { user } } = await supabase.auth.getUser()
    const path = request.nextUrl.pathname

    // ไม่ login → redirect /login (ยกเว้นหน้า public)
    if (!user &&
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

    if (user) {
        // ห้ามกลับหน้า login/register
        if (path.startsWith('/login') || path.startsWith('/register')) {
            const url = request.nextUrl.clone()
            url.pathname = '/dashboard'
            return NextResponse.redirect(url)
        }

        // ตรวจสอบ admin/banned เฉพาะตอนเข้า /admin เท่านั้น
        if (path.startsWith('/admin')) {
            const { data: profile } = await supabase
                .from("profile")
                .select("role, account_status")
                .eq("user_id", user.id)
                .single()

            if (profile?.account_status === "banned" || profile?.role !== 'admin') {
                const url = request.nextUrl.clone()
                url.pathname = '/dashboard'
                return NextResponse.redirect(url)
            }
        }
    }

    return supabaseResponse
}