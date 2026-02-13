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
                {children}
            </div>
        </div>
    )
}