"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { createClient } from "@/utils/supabase/client"
import { useState } from "react"
import { useRouter } from "next/navigation"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { OtpModal } from "@/app/(auth)/register/components/otp-modal"

const loginSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [authError, setAuthError] = useState<string | null>(null)

    const [otpOpen, setOtpOpen] = useState(false)
    const [otpToken, setOtpToken] = useState("")
    const [otpLoading, setOtpLoading] = useState(false)
    const [otpError, setOtpError] = useState<string | null>(null)
    const [pendingEmail, setPendingEmail] = useState("")
    const [pendingPassword, setPendingPassword] = useState("")

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    const supabase = createClient()

    const onSubmit = async (data: LoginFormValues) => {
        setLoading(true)
        setAuthError(null)

        const { error } = await supabase.auth.signInWithOtp({
            email: data.email,
            options: {
                shouldCreateUser: false,
            },
        })

        if (error) {
            setAuthError(error.message)
            setLoading(false)
        } else {
            setPendingEmail(data.email)
            setPendingPassword(data.password)
            setOtpOpen(true)
            setLoading(false)
        }
    }

    const signInWithGoogle = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/callback`,
            },
        })

        if (error) {
            console.error(error)
        }
    }

    const handleVerifyOtp = async () => {
        if (!otpToken) {
            setOtpError("Please enter the 6-digit code")
            return
        }
        setOtpLoading(true)
        setOtpError(null)

        const { error } = await supabase.auth.verifyOtp({
            email: pendingEmail,
            token: otpToken,
            type: 'email'
        })

        if (error) {
            setOtpError(error.message)
            setOtpLoading(false)
        } else {

            setOtpOpen(false)
            router.push("/dashboard")
            router.refresh()
        }
    }

    const handleOtpOpenChange = (open: boolean) => {
        setOtpOpen(open)
        if (!open) {
            setOtpToken("")
            setOtpError(null)
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 md:p-8">
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-1 text-center">
                                <h1 className="text-2xl font-bold">Login to your account</h1>
                                <p className="text-muted-foreground text-sm text-balance">
                                    Enter your email below to login to your account
                                </p>
                            </div>
                            {authError && (
                                <div className="text-red-500 text-sm text-center">{authError}</div>
                            )}
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    {...form.register("email")}
                                />
                                {form.formState.errors.email && (
                                    <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                                )}
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                    <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    {...form.register("password")}
                                />
                                {form.formState.errors.password && (
                                    <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
                                )}
                            </Field>
                            <Field>
                                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                                    {loading ? "Logging in..." : "Login"}
                                </Button>
                            </Field>
                            <FieldSeparator>Or continue with</FieldSeparator>
                            <Field className="gap-4">
                                <Button variant="outline" type="button" onClick={signInWithGoogle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path
                                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span>Sign in with Google</span>
                                </Button>
                            </Field>
                            <FieldDescription className="text-center">
                                Don&apos;t have an account?{" "}
                                <a href="register" className="underline underline-offset-4 text-blue-600 hover:text-blue-700">
                                    Sign up
                                </a>
                            </FieldDescription>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
            <OtpModal
                otpOpen={otpOpen}
                handleOtpOpenChange={handleOtpOpenChange}
                pendingEmail={pendingEmail}
                otpError={otpError}
                otpToken={otpToken}
                setOtpToken={setOtpToken}
                handleVerifyOtp={handleVerifyOtp}
                otpLoading={otpLoading}
            />
        </div>
    )
}

