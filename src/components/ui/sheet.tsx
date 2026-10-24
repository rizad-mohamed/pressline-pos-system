"use client";
import * as Dialog from "@radix-ui/react-dialog";
import { useRef } from "react";
import { X } from "lucide-react";
import { Button } from "./button";
export const SheetClose = Dialog.Close;
export function Sheet({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  dirty = false,
  trigger,
  onAfterClose,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  dirty?: boolean;
  trigger?: React.ReactNode;
  onAfterClose?: () => void;
}) {
  const returnFocus = useRef<HTMLElement | null>(null);
  function change(next: boolean) {
    if (
      !next &&
      dirty &&
      !window.confirm(
        "Discard unsaved changes in this drawer? Your saved records will stay as they are.",
      )
    )
      return;
    onOpenChange(next);
  }
  return (
    <Dialog.Root open={open} onOpenChange={change}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className="overlay" />
        <Dialog.Content
          className="sheet"
          // Portal events still bubble through React parents, including a POS form.
          onSubmit={(event) => event.stopPropagation()}
          onOpenAutoFocus={() => {
            returnFocus.current =
              document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null;
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            const target = returnFocus.current?.isConnected
              ? returnFocus.current
              : document.getElementById("main-content");
            target?.focus();
            onAfterClose?.();
          }}
        >
          <div className="sheet-header">
            <div className="row between">
              <Dialog.Title className="sheet-title">{title}</Dialog.Title>
              <Dialog.Close asChild>
                <Button variant="ghost" size="icon" aria-label="Close drawer">
                  <X size={20} />
                </Button>
              </Dialog.Close>
            </div>
            <Dialog.Description className="sheet-description">
              {description}
            </Dialog.Description>
          </div>
          <div className="sheet-body">{children}</div>
          {footer && <div className="sheet-footer">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
