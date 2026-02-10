// frontend/middleware.ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/auth-middleware' // Import จากไฟล์ข้อ 1

export async function middleware(request: NextRequest) {
    // เรียกใช้ฟังก์ชันที่เราเขียนไว้
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}