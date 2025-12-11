import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldCheck } from "lucide-react";

interface PinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
}

const CORRECT_PIN = "764581";

export function PinDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  title = "Enter PIN to Confirm",
  description = "Please enter your 6-digit PIN to proceed with this action.",
}: PinDialogProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (pin === CORRECT_PIN) {
      setError(false);
      setPin("");
      onConfirm();
    } else {
      setError(true);
      setPin("");
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setPin("");
      setError(false);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <InputOTP
            maxLength={6}
            value={pin}
            onChange={(value) => {
              setPin(value);
              setError(false);
            }}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          {error && (
            <p className="text-sm text-destructive">Incorrect PIN. Please try again.</p>
          )}
          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="glow"
              className="flex-1"
              onClick={handleSubmit}
              disabled={pin.length !== 6 || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
