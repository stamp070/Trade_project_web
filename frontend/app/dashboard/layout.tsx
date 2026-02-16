import Sidebar from './components/sidebar'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-slate-50/50">
            <div className='flex flex-col md:flex-row gap-6 max-w-7xl mx-auto px-6 py-6 '>
                <div className='w-full md:w-64 shrink-0'>
                    <Sidebar />
                </div>
                <div className='flex-1'>
                    {children}
                </div>
            </div>
        </div>
    )
}