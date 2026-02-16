
import TopDashboard from "./components/top-dashboard"
import BottomDashboard from "./components/bottom-dashboard"

export default function AdminPage() {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6">
                <TopDashboard />
            </div>
            <BottomDashboard />
        </div>
    )
}