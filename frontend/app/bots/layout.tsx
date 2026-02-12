import Navbar from '@/components/navbar/Navbar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-slate-50/50 min-h-screen">
            <Navbar />
            <div className='max-w-6xl mx-auto px-6 py-12'>
                <div className='mb-12 text-center'>
                    <h1 className='text-4xl font-bold mb-4 text-slate-900'>Choose Your Trading Bot</h1>
                    <p className='text-lg text-slate-600 mb-1'>Select from our premium automated trading bots optimized for different</p>
                    <p className='text-lg text-slate-600'>currency pairs and connect directly to your MT5 platform.</p>
                </div>
                {children}
            </div>
        </div>
    )
}