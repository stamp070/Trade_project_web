"use client"
import { useState, useEffect } from "react"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/provider/auth-provider";
import { createToken, createAccount } from "@/services/mt5";
import { useRouter } from 'next/navigation'
import { showToast } from "@/lib/toast-style";
import { Copy } from "lucide-react";

interface Mt5ModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}
const formSchema = z.object({
    account_name: z.string().min(3, "Name must be at least 3 characters long"),
    mt5_name: z.string().length(10, "MT5 ID must be 10 digits").regex(/^\d+$/, "Must be only digits"),
})
export default function Mt5Modal({ isOpen, onOpenChange, onSuccess }: Mt5ModalProps) {
    const { session, isLoading: isAuthLoading } = useAuth()
    const [token, setToken] = useState("")
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            account_name: "",
            mt5_name: "",
        },
    })
    const mt5Name = form.watch("mt5_name")
    const accountName = form.watch("account_name")


    async function onSubmit() {
        try {
            const res = await createAccount(session?.access_token || "", {
                mt5_name: mt5Name,
                account_name: accountName,
                token: token,
            })
            if (res?.status == "success") {
                onOpenChange(false)
                form.reset()
                showToast.success("MT5 account created successfully")
                if (onSuccess) {
                    onSuccess()
                }
            }
        } catch (error) {
            showToast.error("Failed to create MT5 account")
        }
    }

    const generateToken = async () => {
        try {
            const res = await createToken(session?.access_token || "", {
                mt5_name: mt5Name,
                account_name: accountName,
            })
            if (res?.status == "success") {
                setToken(res?.token || "")
            }
        } catch (error) {
            console.error("Error generating token:", error)
        }
    }


    useEffect(() => {
        const timer = setTimeout(() => {
            if (mt5Name && accountName && mt5Name.length === 10) {
                generateToken()
            } else {
                setToken("")
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [mt5Name, accountName])


    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Connect MT5 Account</DialogTitle>
                    <DialogDescription>
                        Enter your MT5 account details below.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="account_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>

                            )}
                        />
                        <FormField
                            control={form.control}
                            name="mt5_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>MT5 ID</FormLabel>
                                    <FormControl>
                                        <Input placeholder="MT5 ID" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {<FormItem>
                            <FormLabel>Token</FormLabel>
                            <div className="relative">
                                <Input
                                    value={token}
                                    placeholder="TOKEN FOR AUTHENTICATE"
                                    readOnly
                                    className="bg-slate-100 text-slate-500 cursor-pointer font-mono pr-10"
                                    onClick={() => {
                                        if (token) {
                                            navigator.clipboard.writeText(token)
                                            showToast.success("Token copied to clipboard")
                                        }
                                    }}
                                />
                                <Copy
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600"
                                    onClick={() => {
                                        if (token) {
                                            navigator.clipboard.writeText(token)
                                            showToast.success("Token copied to clipboard")
                                        }
                                    }}
                                />
                            </div>
                            <p className="text-xs text-slate-600 pl-2">Click to copy token</p>
                        </FormItem>}
                        <Button type="submit" disabled={!token}>Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}