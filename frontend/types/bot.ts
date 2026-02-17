export interface Bot {
    bot_id: string
    name: string
    version: string
    pnl: number
    today: number
    connection: string
    trades: number
}

export interface BotOption {
    id: string
    label: string
}

export interface BotData {
    bots_version: BotOption[]
    mt5_accounts: BotOption[]
}

export interface BotCreate {
    version_id: string
    mt5_id: string
    currency: string
}


