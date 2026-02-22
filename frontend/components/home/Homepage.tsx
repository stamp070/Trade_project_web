'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, BarChart3, ShieldCheck, Zap, Euro, Coins, DollarSign, TrendingUp } from "lucide-react";
import Link from "next/link"
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { showToast } from "@/lib/toast-style";
import TradingChart from "@/components/chart/trading-chart";


export default function Home() {
    const error = useSearchParams()

    useEffect(() => {
        if (error.get('error') === 'banned') {
            showToast.error('Your account has been banned')
        }
    }, [error])
    return (
        <main className="min-h-screen bg-slate-50 font-sans text-slate-900">

            {/* ================= Hero Section (No Navbar) ================= */}
            <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white py-24 md:py-32 px-6 md:px-12 overflow-hidden">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <div className="space-y-8 z-10">
                        <div className="inline-block px-4 py-1.5 bg-blue-500/20 rounded-full text-blue-200 text-sm font-medium border border-blue-500/30">
                            Automated Trading Made Simple
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                            Automated Trading <br />
                            <span className="text-blue-400">Made Simple</span>
                        </h1>

                        <p className="text-lg text-blue-100 max-w-xl leading-relaxed">
                            Harness the power of AI-driven trading bots to maximize your investment returns.
                            Start your automated trading journey today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/register">
                                <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 h-14 px-8 text-lg font-bold shadow-lg shadow-blue-900/20">
                                    Start Trading Now
                                </Button>
                            </Link>

                        </div>

                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-blue-700/50 mt-8">
                            <div>
                                <p className="text-3xl md:text-4xl font-bold text-blue-400">10%</p>
                                <p className="text-xs md:text-sm text-blue-200 mt-1">Commission Only</p>
                            </div>
                            <div>
                                <p className="text-3xl md:text-4xl font-bold text-blue-400">90%</p>
                                <p className="text-xs md:text-sm text-blue-200 mt-1">Your Profits</p>
                            </div>
                            <div>
                                <p className="text-3xl md:text-4xl font-bold text-blue-400">24/7</p>
                                <p className="text-xs md:text-sm text-blue-200 mt-1">Automated Trading</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Content: Abstract Chart Graphic  */}
                    <TradingChart />
                </div>
            </section>

            {/* ================= Bot Section  ================= */}
            <section className="py-24 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Choose Your Trading Bot</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            Select from our range of specialized trading bots designed for different strategies
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Bot 1: EUR/USD  */}
                        <BotCard
                            icon={<Euro className="w-6 h-6 text-blue-600" />}
                            title="EUR / USD Bot"
                            stats={{
                                label: "Winrate",
                                value: "52%",
                                maxDD: "-1.25%",
                                timeframe: "1 Hr."
                            }}
                        />
                        {/* Bot 2: XAU/USD */}
                        <BotCard
                            icon={<Coins className="w-6 h-6 text-yellow-600" />}
                            title="XAU / USD Bot"
                            stats={{
                                label: "Success Rate", // ตาม PDF ใช้คำว่า Success Rate
                                value: "54%",
                                maxDD: "-2%",
                                timeframe: "1 Hr."
                            }}
                        />
                        {/* Bot 3: JPY/USD */}
                        <BotCard
                            icon={<DollarSign className="w-6 h-6 text-purple-600" />}
                            title="JPY / USD Bot"
                            stats={{
                                label: "Success Rate",
                                value: "51%",
                                maxDD: "-0.5%",
                                timeframe: "1 Hr."
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* ================= How It Works Section ================= */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">How Trading bot works? </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                            Advanced trading technology meets user-friendly design for optimal trading performance
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        {/* Feature 1 */}
                        <FeatureItem
                            icon={<Zap className="w-10 h-10 text-blue-600" />}
                            title="AI-Powered Bots"
                            desc="Advanced machine learning algorithms analyze market trends and execute trades automatically"
                        />
                        {/* Feature 2 */}
                        <FeatureItem
                            icon={<ShieldCheck className="w-10 h-10 text-blue-600" />}
                            title="Secure & Reliable"
                            desc="Bank-level security with 99.9% uptime guarantee for uninterrupted Trading"
                        />
                        {/* Feature 3 */}
                        <FeatureItem
                            icon={<BarChart3 className="w-10 h-10 text-blue-600" />}
                            title="Real-time Analytics"
                            desc="Comprehensive dashboards with live market data and performance insights"
                        />
                    </div>
                </div>
            </section>

            {/* ================= Pricing Section ================= */}
            <section className="py-24 px-6 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-4xl font-bold">Fair & Transparent Pricing </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                            We only succeed when you succeed. Our 10% commission model aligns our interests with yours.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Pricing Card 1  */}
                        <PricingCard
                            title="10% Commission"
                            desc="We only charge 10% of your actual profits. No hidden fees, no monthly subscriptions"
                        >
                            <div className="bg-slate-800 p-6 rounded-lg space-y-3 text-sm mt-6 border border-slate-700">
                                <p className="text-slate-500 text-center text-xs uppercase tracking-wider font-bold mb-3">Example </p>
                                <div className="flex justify-between"><span>Profit:</span> <span className="text-green-400 font-mono">$1,000</span></div>
                                <div className="flex justify-between"><span>Our fee:</span> <span className="text-red-400 font-mono">$100</span></div>
                                <Separator className="bg-slate-600 my-2" />
                                <div className="flex justify-between font-bold text-base"><span>You keep:</span> <span className="text-green-400">$900</span></div>
                            </div>
                        </PricingCard>

                        {/* Pricing Card 2 */}
                        <PricingCard
                            title="90% Your Profits"
                            desc="Keep the vast majority of your trading profits. Our success is directly tied to your success"
                        >
                            <div className="bg-slate-800 p-6 rounded-lg space-y-3 text-sm mt-6 border border-slate-700">
                                <p className="text-slate-500 text-center text-xs uppercase tracking-wider font-bold mb-3">Monthly Average </p>
                                <div className="flex justify-between"><span>Total Profit:</span> <span className="text-green-400 font-mono">$5,000</span></div>
                                <div className="flex justify-between"><span>Our fee:</span> <span className="text-red-400 font-mono">$500</span></div>
                                <Separator className="bg-slate-600 my-2" />
                                <div className="flex justify-between font-bold text-base"><span>You earn:</span> <span className="text-green-400">$4,500</span></div>
                            </div>
                        </PricingCard>

                        {/* Pricing Card 3 */}
                        <PricingCard
                            title="No Loss, No Fee"
                            desc="If the bot doesn't make profit, you pay nothing. We only charge when you earn."
                        >
                            <div className="bg-slate-800 p-6 rounded-lg space-y-3 text-sm mt-6 border border-slate-700">
                                <p className="text-slate-500 text-center text-xs uppercase tracking-wider font-bold mb-3">Guarantee </p>
                                <div className="flex justify-between"><span>No Profit:</span> <span className="text-slate-400 font-mono">$0</span></div>
                                <div className="flex justify-between"><span>Our fee:</span> <span className="text-green-400 font-mono">$0</span></div>
                                <Separator className="bg-slate-600 my-2" />
                                <div className="flex justify-between font-bold text-base"><span>You pay:</span> <span className="text-green-400">Nothing</span></div>
                            </div>
                        </PricingCard>
                    </div>
                </div>
            </section>

            {/* ================= CTA Section ================= */}
            <section className="py-24 bg-blue-50 text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Ready to Start Your Trading Journey? </h2>
                    <p className="text-slate-600 mb-10 text-lg">
                        Join thousands of successful traders using our automated trading platform
                    </p>
                    <Link href="/register">
                        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 h-14 px-10 text-lg shadow-xl shadow-blue-600/20">
                            Create Free Account
                        </Button>
                    </Link>
                </div>
            </section>

            {/* ================= Footer ================= */}
            <footer className="bg-white border-t py-12 text-center text-slate-500 text-sm">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="mb-3 font-medium">© 2026 TradingBot All rights reserved </p>
                    <p className="text-xs text-slate-400">Investments involve risk. Please research thoroughly before trading. </p>
                </div>
            </footer>
        </main>
    );
}

// ================= Helper Components =================

function BotCard({ icon, title, stats }: { icon: any, title: string, stats: any }) {
    return (
        <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="p-3 bg-slate-100 rounded-xl">
                    {icon}
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
                <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">{stats.label}</span>
                    <span className="text-green-600 font-bold text-lg">{stats.value}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Max DD</span>
                    <span className="text-red-500 font-bold text-lg">{stats.maxDD}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Timeframe</span>
                    <span className="text-slate-900 font-bold text-lg">{stats.timeframe}</span>
                </div>
            </CardContent>
        </Card>
    )
}

function FeatureItem({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="flex flex-col items-center group">
            <div className="p-5 bg-blue-50 rounded-full mb-6 group-hover:bg-blue-100 transition-colors">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed max-w-sm">
                {desc}
            </p>
        </div>
    )
}

function PricingCard({ title, desc, children }: { title: string, desc: string, children: React.ReactNode }) {
    return (
        <Card className="bg-[#1e293b] border-slate-700 text-white flex flex-col h-full hover:border-blue-500/50 transition-colors">
            <CardHeader>
                <div className="mb-4 w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-2xl font-bold text-blue-400 mb-2">{title}</CardTitle>
                <CardDescription className="text-slate-400 text-base leading-relaxed">
                    {desc}
                </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-0">
                {children}
            </CardContent>
        </Card>
    )
}