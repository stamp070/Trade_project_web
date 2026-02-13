// กราฟเส้น (Pnl Overview)
export interface PnlGraph {
    day: string
    pnl: number
}
// กราฟวงกลม
export interface PnlCircle {
    name: string
    value: number
}

export interface Account {
    mt5_id: string
    user_id: string
    account_name: string
    token: string
    balance: number
    created_at: string
    pnl: number
}

export interface DashboardData {
    balance: number
    active_bots: number
    total_orders: number
    total_wins: number
    win_rate: number
    total_pnl: number
    status: string
    accounts: Account[]
    pnl_graph: PnlGraph[]
    pnl_circle: PnlCircle[]
}

export interface Bot {
    bot_id: string
    name: string
    version: string
    pnl: number
    today: number
    connection: string
    trades: number
}

export interface RecentTrade {
    time: string
    symbol: string
    type: string
    volume: number
    pnl: number
}

export interface DashboardAccountsData {
    name: string
    balance: number
    pnl: number
    due_date: string
    active_bots: number
    win_rate: number
    total_orders: number
    total_wins: number
    bots: Bot[]
    recent_trades: RecentTrade[]
    pnl_graph: PnlGraph[]
    pnl_circle: PnlCircle[]
}
