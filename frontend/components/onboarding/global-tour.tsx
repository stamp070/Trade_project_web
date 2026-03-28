"use client"

import { Tour, TourProps } from "antd"
import { useState, useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/provider/auth-provider"

export default function GlobalTour() {
    const pathname = usePathname()
    const { user, tourState, updateTourState, isLoading } = useAuth()

    // ใช้ Ref เก็บค่าล่าสุดของ tourState เพื่อไม่ต้องใส่ใน dependency array
    const tourStateRef = useRef(tourState)
    useEffect(() => { tourStateRef.current = tourState }, [tourState])

    // State of the current active tour
    const [open, setOpen] = useState(false)
    const [currentSteps, setCurrentSteps] = useState<TourProps['steps']>([])
    const [tourId, setTourId] = useState<string | null>(null)

    const isTourSeen = (id: string) => {
        if (!user) return true
        return !!tourStateRef.current[id]
    }

    const handleClose = () => {
        setOpen(false)
    }

    const waitForElement = (id: string, maxWait = 10000): Promise<HTMLElement | null> => {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                const el = document.getElementById(id)
                if (el && el.getBoundingClientRect().height > 0) {
                    clearInterval(interval)
                    resolve(el)
                }
            }, 500)
            setTimeout(() => { clearInterval(interval); resolve(null) }, maxWait)
        })
    }

    useEffect(() => {
        if (isLoading || !user || !pathname) return

        setOpen(false)
        setCurrentSteps([])

        let cancelled = false

        const run = async () => {
            if (pathname === '/dashboard' && !isTourSeen('dashboard')) {
                const el = await waitForElement('tour-equity-chart')
                if (cancelled || !el) return
                setTourId('dashboard')
                setCurrentSteps([
                    {
                        title: '📊 Dashboard Overview',
                        description: 'Now that you have connected an account, you can see your aggregated portfolio performance here.',
                        target: () => document.getElementById('tour-equity-chart') as HTMLElement,
                        placement: 'bottom',
                    },
                    {
                        title: "➕ MT5 Account",
                        description: "Click here to add your MT5 account by enter your MT5 ID and portfolio name",
                        target: () => document.getElementById('tour-add-mt5') as HTMLElement,
                        placement: 'right',
                    },
                    {
                        title: '💰 Account Balance',
                        description: 'This card shows your total balance across all connected accounts.',
                        target: () => document.getElementById('tour-balance-cards') as HTMLElement,
                        placement: 'right',
                    },
                    {
                        title: '📈 Performance Stats',
                        description: 'Track your total orders, wins, and win rate at a glance.',
                        target: () => document.getElementById('tour-stats-footer') as HTMLElement,
                        placement: 'top',
                    },
                    {
                        title: '🔍 Your MT5 Accounts',
                        description: 'This section will show your connected MT5 accounts.',
                        target: () => document.getElementById('tour-mt5-accounts') as HTMLElement,
                        placement: 'top',
                    }
                ])
                setOpen(true)
                updateTourState('dashboard')
            }

            else if (pathname === '/bots' && !isTourSeen('bots_page')) {
                const el = await waitForElement('tour-bots-header')
                if (cancelled || !el) return
                setTourId('bots_page')
                setCurrentSteps([
                    {
                        title: '🤖 Trading Bots',
                        description: 'Welcome to the Bots page! Here you can find add our bot to your MT5 account.',
                        target: () => document.getElementById('tour-bots-header') as HTMLElement,
                        placement: 'bottom',
                    },
                    {
                        title: '⚙️ Configure Bot',
                        description: 'You can configure a bot version and assign it to your connected MT5 accounts using this card.',
                        target: () => document.getElementById('tour-bot-card-0') as HTMLElement,
                        placement: 'right',
                    }
                ])
                setOpen(true)
                updateTourState('bots_page')
            }

            else if (pathname.startsWith('/dashboard/') && pathname !== '/dashboard' && !isTourSeen('account_detail')) {
                const el = await waitForElement('tour-account-equity')
                if (cancelled || !el) return
                setTourId('account_detail')
                setCurrentSteps([
                    {
                        title: '🔍 Account Details',
                        description: 'This page shows performance specific to this individual MT5 account.',
                        target: () => document.getElementById('tour-account-equity') as HTMLElement,
                        placement: 'bottom',
                    },
                    {
                        title: '🤖 Bot Connections',
                        description: 'You can turn your connected bots on or off for this specific account right here.',
                        target: () => document.getElementById('tour-account-bots') as HTMLElement,
                        placement: 'left',
                    },
                    {
                        title: '📋 Recent Trades',
                        description: 'A detailed log of all recent buy/sell orders executed on this account.',
                        target: () => document.getElementById('tour-account-trades') as HTMLElement,
                        placement: 'top',
                    }
                ])
                setOpen(true)
                updateTourState('account_detail')
            }
        }

        run()
        return () => { cancelled = true }
    }, [pathname, user, isLoading])

    if (!open || !currentSteps || currentSteps.length === 0) return null

    return (
        <Tour
            open={open}
            onClose={handleClose}
            steps={currentSteps || []}
            type="primary"
            mask={false}
        />
    )
}
