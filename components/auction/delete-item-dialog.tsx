"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

export function DeleteItemDialog({
  open,
  onClose,
  onConfirm,
  itemName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-2xl">
        <AlertDialogHeader className="space-y-3">
          <AlertDialogTitle className="text-xl">
            Hapus {itemName ? `"${itemName}"` : "item ini"}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-relaxed">
            Tindakan ini tidak dapat dibatalkan. Item akan dihapus permanen dari
            inventaris kamu. Item yang sudah terjual tetap terkunci dan tidak
            bisa dihapus.
          </AlertDialogDescription>
          <Badge variant="destructive" className="w-fit rounded-full">
            Dangerous action
          </Badge>
        </AlertDialogHeader>

        <div className="rounded-xl border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
          Tip: sembunyikan item jika hanya ingin menghentikannya sementara.
        </div>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel className="rounded-full px-6">Batal</AlertDialogCancel>
          <AlertDialogAction
            className="rounded-full bg-red-600 text-white hover:bg-red-700 px-6"
            onClick={onConfirm}
          >
            Hapus Item
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
