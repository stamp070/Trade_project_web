import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const supabase = await createClient()

    // Sign out on the server
    const { error } = await supabase.auth.signOut()

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Redirect to login
    return NextResponse.redirect(new URL('/login', request.url), {
        status: 302,
    })
}
