import BotsCard from "./components/bots_card"

export default function Bots() {
    // Mock data for modal options
    const versions = [
        { id: 'v1.0.0', label: 'Version 1.0.0 (Stable)' },
        { id: 'v1.1.0', label: 'Version 1.1.0 (Beta)' },
    ]

    const accounts = [
        { id: 'acc_1', label: 'Main Account (123456)' },
        { id: 'acc_2', label: 'Demo Account (987654)' },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            <BotsCard
                name="EUR/USD Bot"
                winRate={52}
                maxDd={-8.2}
                timeframe="1 Hr."
                lastUpdate="22 / 12 / 2025"
                versions={versions}
                accounts={accounts}
            />
            <BotsCard
                name="XAU/USD Bot"
                winRate={52}
                maxDd={-8.2}
                timeframe="1 Hr."
                lastUpdate="22 / 12 / 2025"
                versions={versions}
                accounts={accounts}
            />
            <BotsCard
                name="JPY/USD Bot"
                winRate={52}
                maxDd={-8.2}
                timeframe="1 Hr."
                lastUpdate="22 / 12 / 2025"
                versions={versions}
                accounts={accounts}
            />
        </div>
    )
}