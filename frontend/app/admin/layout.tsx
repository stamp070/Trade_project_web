import Navbar from '@/components/navbar/Navbar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-slate-50/50 min-h-screen">
            <div className='max-w-6xl mx-auto px-12 py-12'>
                {children}
            </div>
        </div>
    )
}