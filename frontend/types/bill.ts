
export interface Invoice {
    invoice_id: string
    user_id: string
    start_period: string
    end_period: string
    total_profit: number
    commission_rate: number
    commission_amount: number
    status: 'unpaid' | 'paid'
    payment_id: string | null
    paid_at: string | null
    due_date: string
}


export interface CheckoutRequest {
    invoice_id: string
}