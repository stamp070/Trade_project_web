import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Mt5ModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}
const Token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
const formSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    mt5_id: z.string().length(10, "MT5 ID must be 10 digits").regex(/^\d+$/, "Must be only digits"),
})
// mock token

export default function Mt5Modal({ isOpen, onOpenChange }: Mt5ModalProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            mt5_id: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
        onOpenChange(false)
    }
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
                            name="name"
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
                            name="mt5_id"
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
                        <FormItem>
                            <FormLabel>Token</FormLabel>
                            <Input
                                placeholder={Token}

                                className="bg-slate-100 text-slate-500 cursor-pointer font-mono"
                                onClick={() => navigator.clipboard.writeText(Token)}
                            />
                        </FormItem>

                        <Button type="submit" >Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}