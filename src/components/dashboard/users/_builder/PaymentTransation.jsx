import DataTable from "@/components/shared/clientDataTable";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { convertTime, convertToDate } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { createTransaction, updatePaymentTransaction } from "@/lib/api/client/payment/urls";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PaymentTransation = ({ isOpen, setIsOpen, userData }) => {
  console.log(userData);
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [userPaymentTransactions, setUserPaymentTransactions] = useState([]);
  const [isPaymentUpdateLoading, setIsPaymentUpdateLoading] = useState(false);

  useEffect(() => {
    setUserPaymentTransactions(userData?.user_payment_transactions || []);
  }, [userData]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await createTransaction({ transaction_id: transactionId, transaction_amount: amount, user_id: userData?.id });
      toast.success("Payment submitted successfully");
      setTransactionId("");
      setAmount(0);
      setShowAddForm(false);
      setUserPaymentTransactions([
        {
          transaction_id: transactionId,
          transaction_amount: amount,
          transaction_status_name: "Pending",
          operation_count: 0,
          created_at: new Date().toISOString(),
        },
        ...userPaymentTransactions,
      ]);
    } catch (error) {
      const errorMessage = JSON.parse(error?.message);
      toast.error(errorMessage?.error || "Failed to submit payment");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentTransactionUpdate = async (id, status) => {
    setIsPaymentUpdateLoading(true);
    try {
      const payload = {
        transaction_status: status,
      };
      const res = await updatePaymentTransaction(id, payload);
      toast.success("Payment transaction updated successfully");
      setUserPaymentTransactions(
        userPaymentTransactions.map((transaction) =>
          transaction.id == id
            ? {
                ...transaction,
                transaction_status_name: res.data.transaction_status_name,
                transaction_status: res.data.transaction_status,
                transaction_active_from_date: res.data.transaction_active_from_date,
              }
            : transaction
        )
      );
    } catch (error) {
      const errorMessage = JSON.parse(error?.message);
      toast.error(errorMessage?.error || "Failed to update payment transaction");
    } finally {
      setIsPaymentUpdateLoading(false);
    }
  };

  const columns = [
    {
      header: "Transaction ID",
      accessorKey: "transaction_id",
    },
    {
      header: "Amount",
      accessorKey: "transaction_amount",
    },
    {
      header: "Status",
      accessorKey: "transaction_status_name",
      cell: ({ row }) => {
        return (
          <div>
            <Badge
              variant={
                row.original.transaction_status === 0
                  ? "warning"
                  : row.original.transaction_status === 1
                  ? "success"
                  : "failed"
              }
            >
              {row.original.transaction_status_name}
            </Badge>
          </div>
        );
      },
    },
    {
      header: "Total Operations",
      accessorKey: "operation_count",
    },
    {
      header: "Transaction Active From Date",
      accessorKey: "transaction_active_from_date",
      cell: ({ row }) => {
        return (
          <div>
            {row.original.transaction_active_from_date
              ? convertToDate(row.original.transaction_active_from_date)
              : "-"}
          </div>
        );
      },
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: ({ row }) => {
        return <div>{convertTime(row.original.created_at)}</div>;
      },
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => {
        return (
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <EllipsisVertical className="w-4 h-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handlePaymentTransactionUpdate(row.original.id, 1)}>
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handlePaymentTransactionUpdate(row.original.id, 2)}>
                  Reject
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-[90vw] sm:max-w-5xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Payments for {userData?.id}</SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-4">
            {/* Compact user info */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap text-xs text-gray-700">
                <div>
                  Name
                  <div className="font-semibold text-gray-900">
                    {(userData?.first_name || "") + " " + (userData?.last_name || "")}
                  </div>
                </div>
                <div className="border-l border-gray-200 pl-2">
                  Email
                  <div className="font-semibold text-gray-900">{userData?.email}</div>
                </div>
                <div className="border-l border-gray-200 pl-2">
                  Phone
                  <div className="font-semibold text-gray-900">{userData?.phone}</div>
                </div>
                <div className="border-l border-gray-200 pl-2">
                  Role
                  <div className="font-semibold text-gray-900">{userData?.role_name}</div>
                </div>
              </div>
            </div>
            {!showAddForm ? (
              <Button variant="secondary" size="sm" onClick={() => setShowAddForm(true)}>
                Add Payment
              </Button>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="w-48">
                  <Input
                    type="text"
                    placeholder="Enter Transaction ID"
                    className="h-8 px-2 text-xs"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>
                <div className="w-32">
                  <Input
                    type="number"
                    placeholder="Enter Amount"
                    className="h-8 px-2 text-xs"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleSubmit}
                  disabled={isLoading || !transactionId || !amount}
                >
                  {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false);
                    setTransactionId("");
                    setAmount(0);
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            )}
            <DataTable columns={columns} data={userPaymentTransactions} showFilter={false} showPagination={false} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PaymentTransation;
