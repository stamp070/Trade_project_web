import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function Mt5Modal(
    onClose: () => void,
    open: boolean,
) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Mt5 Modal</DialogTitle>
                    <DialogDescription>
                        Mt5 Modal
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}