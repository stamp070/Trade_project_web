"use client"

import Link from "next/link"
import { LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuLink,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">

                {/* --- 1. Logo Section (Left) --- */}
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <LineChart className="text-white w-5 h-5" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-blue-900">
                        TradingBot
                    </span>
                </div>

                {/* --- 2. Menu Links (Center) --- */}
                {/* ซ่อนบนมือถือ (hidden md:flex) เพื่อไม่ให้รก */}
                <div className="hidden md:flex">
                    <Link href="/">
                        <Button variant="ghost" className="text-slate-600 hover:bg-transparent hover:text-blue-600 no-underline hover:underline underline-offset-4">
                            Home
                        </Button>
                    </Link>
                    <Link href="/Dashboard">
                        <Button variant="ghost" className="text-slate-600 hover:bg-transparent hover:text-blue-600 no-underline hover:underline underline-offset-4">
                            Dashboard
                        </Button>
                    </Link><Link href="/bots">
                        <Button variant="ghost" className="text-slate-600 hover:bg-transparent hover:text-blue-600 no-underline hover:underline underline-offset-4">
                            Trading Bots
                        </Button>
                    </Link>
                    <Link href="/bills">
                        <Button variant="ghost" className="text-slate-600 hover:bg-transparent hover:text-blue-600 no-underline hover:underline underline-offset-4">
                            Bills
                        </Button>
                    </Link><Link href="/login">
                        <Button variant="ghost" className="text-slate-600 hover:bg-transparent hover:text-blue-600 no-underline hover:underline underline-offset-4">
                            Log In
                        </Button>
                    </Link>
                    <Link href="/admin">
                        <Button variant="ghost" className="text-slate-600 hover:bg-transparent hover:text-blue-600 no-underline hover:underline underline-offset-4">
                            Admin
                        </Button>
                    </Link>
                </div>

                {/* --- 3. Action Buttons (Right) --- */}
                <div className="flex items-center gap-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-slate-600 hover:text-blue-600">
                            Log In
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button className="bg-blue-600 hover:bg-blue-700 font-semibold">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}