import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface OtpModalProps {
    otpOpen: boolean
    handleOtpOpenChange: (open: boolean) => void
    pendingEmail: string
    otpError: string | null
    otpToken: string
    setOtpToken: (token: string) => void
    handleVerifyOtp: () => void
    otpLoading: boolean
}

export function OtpModal({ otpOpen, handleOtpOpenChange, pendingEmail, otpError, otpToken, setOtpToken, handleVerifyOtp, otpLoading }: OtpModalProps) {
    return (
        <div>
            <Dialog open={otpOpen} onOpenChange={handleOtpOpenChange}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-xl">
                            Verify your email
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            We sent a 6-digit verification code to <span className="font-semibold text-slate-900">{pendingEmail}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-4 py-2">
                        {otpError && (
                            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md border border-red-200">
                                {otpError}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium">6-Digit Code</label>
                            <Input
                                type="text"
                                placeholder="123456"
                                maxLength={6}
                                className="text-center text-2xl tracking-[0.5em] font-mono"
                                value={otpToken}
                                onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ''))}
                            />
                        </div>
                        <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={handleVerifyOtp}
                            disabled={otpLoading}
                        >
                            {otpLoading ? "Verifying..." : "Verify & Continue"}
                        </Button>
                        <p className="text-xs text-center text-slate-500">
                            Didn&apos;t receive the code? Check your spam folder.
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}