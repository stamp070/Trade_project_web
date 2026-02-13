"use client"
import Link from "next/link"
import { LineChart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SignOutButton } from "./sign-out-button"
import { useAuth } from "@/components/provider/auth-provider"
import { useState } from "react"

export default function Navbar() {
    const { user, isAdmin, session } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">

                {/* --- 1. Logo Section (Left) --- */}
                <Link href="/" className="z-50">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <LineChart className="text-white w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-blue-900">
                            TradingBot
                        </span>
                    </div>
                </Link>

                {/* --- 2. Desktop Menu Links (Center) --- */}
                <div className="hidden md:flex items-center gap-1">
                    <Link href="/">
                        <Button variant="ghost" className="text-slate-600 hover:bg-transparent hover:text-blue-600 hover:underline underline-offset-6">
                            Home
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="ghost" className="text-slate-600 hover:bg-transparent hover:text-blue-600 hover:underline underline-offset-6">
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/bots">
                        <Button variant="ghost" className="text-slate-600 hover:bg-transparent hover:text-blue-600 hover:underline underline-offset-6">
                            Trading Bots
                        </Button>
                    </Link>
                    <Link href="/bills">
                        <Button variant="ghost" className="text-slate-600 hover:bg-transparent hover:text-blue-600 hover:underline underline-offset-6">
                            Bills
                        </Button>
                    </Link>
                    {isAdmin && (
                        <Link href="/admin">
                            <Button variant="ghost" className="text-slate-600 hover:bg-transparent hover:text-blue-600 hover:underline underline-offset-6">
                                Admin
                            </Button>
                        </Link>
                    )}
                </div>

                {/* --- 3. Action Buttons & Mobile Toggle (Right) --- */}
                <div className="flex items-center gap-4">
                    {/* Check if user is logged in */}
                    {user ? (
                        <>
                            <div className="hidden md:flex items-center gap-4">
                                <span className="text-sm text-slate-600">
                                    {user.email?.split('@')[0]}
                                </span>
                                <SignOutButton />
                            </div>
                            {/* Mobile Menu Button */}
                            <button className="md:hidden p-2 text-slate-600" onClick={toggleMenu}>
                                {isMenuOpen ? <X /> : <Menu />}
                            </button>
                        </>
                    ) : (
                        <div className="hidden md:flex gap-2">
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
                    )}
                    {/* Mobile Menu Button for non-logged in users */}
                    {!user && (
                        <button className="md:hidden p-2 text-slate-600" onClick={toggleMenu}>
                            {isMenuOpen ? <X /> : <Menu />}
                        </button>
                    )}
                </div>
            </div>

            {/* --- Mobile Menu Overlay --- */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b shadow-lg flex flex-col p-4 gap-4 animate-in slide-in-from-top-5">
                    <Link href="/" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-slate-600">Home</Button>
                    </Link>
                    <Link href="/dashboard" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-slate-600">Dashboard</Button>
                    </Link>
                    <Link href="/bots" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-slate-600">Trading Bots</Button>
                    </Link>
                    <Link href="/bills" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-slate-600">Bills</Button>
                    </Link>
                    {isAdmin && (
                        <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start text-slate-600">Admin</Button>
                        </Link>
                    )}

                    <div className="border-t pt-4 flex flex-col gap-3">
                        {user ? (
                            <>
                                <div className="px-4 text-sm text-slate-500">
                                    Signed in as <span className="font-medium text-slate-900">{user.email}</span>
                                </div>
                                <div className="px-4">
                                    <SignOutButton />
                                </div>
                            </>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                    <Button variant="outline" className="w-full">Log In</Button>
                                </Link>
                                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}