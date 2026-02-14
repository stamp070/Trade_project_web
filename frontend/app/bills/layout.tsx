export default function BillsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-slate-50/50 min-h-screen">
            <div className='max-w-6xl mx-auto px-6 py-12'>
                {children}
            </div>
        </div>
    )
}