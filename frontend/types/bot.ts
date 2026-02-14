
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


