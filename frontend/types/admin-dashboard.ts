export interface invoice {
    status: string
    commission_amount: number
}
export interface mt5_id {
    mt5_id: string
}
export interface User {
    email: string
    role: string
    updated_at: string
    mt5_accounts: mt5_id[]
    invoice: invoice[]
}

export interface total {
    total_user: number
    total_mt5: number
    total_commission: number
}