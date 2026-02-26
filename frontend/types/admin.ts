export interface invoice {
    status: string
    due_date: string
}
export interface mt5_id {
    mt5_id: string
}
export interface User {
    user_id: string
    email: string
    role: string
    account_status: string
    updated_at: string
    mt5_accounts: mt5_id[]
    invoice: invoice[]
}

export interface total {
    total_user: number
    total_mt5: number
    total_commission: number
}

export interface get_user_profile {
    email: string
    role: string
}
export interface get_user_bot {
    currency: string
    connection: string
    mt5_accounts: mt5_id[]
}
export interface get_user_invoice {
    commission_amount: string
    status: string
    created_at: string
    due_date: string
}

export interface user_profile {
    profile: get_user_profile[]
    balance: number
    bots: get_user_bot[]
    invoice: get_user_invoice[]

}
