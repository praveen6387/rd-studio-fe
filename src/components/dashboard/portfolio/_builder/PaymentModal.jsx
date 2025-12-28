import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { createTransaction } from "@/lib/api/client/payment/urls";
import { Loader2 } from "lucide-react";

const PaymentModal = ({ isOpen, setIsOpen }) => {
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await createTransaction({ transaction_id: transactionId, transaction_amount: amount });
      toast.success("Payment submitted successfully");
      setTransactionId("");
      setAmount(0);
      setIsOpen(false);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make Payment</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center">
          <Image src="/PhonePayQR.png" alt="QR Code" width={256} height={256} />
          <div className="text-sm text-gray-500">
            Scan the QR code to make the payment then enter the transaction ID and submit for verification
          </div>
        </div>
        <div className="flex gap-x-2 w-full">
          <div className="w-1/2">
            <Input
              type="text"
              placeholder="Enter your Transaction ID"
              className="w-full"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>
          <div className="w-1/2">
            <Input
              type="number"
              placeholder="Enter the amount"
              className="w-full"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
        </div>
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleSubmit}
          disabled={isLoading || !transactionId || !amount}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {isLoading ? "Submitting..." : "Submit For Verification"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
