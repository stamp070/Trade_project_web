
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-slate-50/50 min-h-screen">
            {children}
        </div>

    )
}