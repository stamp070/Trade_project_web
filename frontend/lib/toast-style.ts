import { toast } from "sonner"


export const toastStyle = {
    success: {
        style: {
            '--normal-bg':
                'color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))',
            '--normal-text': 'light-dark(var(--color-green-600), var(--color-green-400))',
            '--normal-border': 'light-dark(var(--color-green-600), var(--color-green-400))'
        } as React.CSSProperties
    },
    error: {
        style: {
            '--normal-bg': 'color-mix(in oklab, var(--destructive) 10%, var(--background))',
            '--normal-text': 'var(--destructive)',
            '--normal-border': 'var(--destructive)'
        } as React.CSSProperties
    },
    warning: {
        style: {
            '--normal-bg':
                'color-mix(in oklab, light-dark(var(--color-amber-600), var(--color-amber-400)) 10%, var(--background))',
            '--normal-text': 'light-dark(var(--color-amber-600), var(--color-amber-400))',
            '--normal-border': 'light-dark(var(--color-amber-600), var(--color-amber-400))'
        } as React.CSSProperties
    }

}

export const showToast = {
    success: (message: string) => {
        toast.success(message, toastStyle.success)
    },
    error: (message: string) => {
        toast.error(message, toastStyle.error)
    },
    warning: (message: string) => {
        toast.warning(message, toastStyle.warning)
    }
}