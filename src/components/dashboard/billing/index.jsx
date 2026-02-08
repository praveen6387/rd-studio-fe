"use client";
import DashboardPageLayout from "@/components/utils/DashboardPagelayout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PaymentModal from "@/components/dashboard/portfolio/_builder/PaymentModal";
import DataTable from "@/components/shared/clientDataTable";
import { convertTime } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";


const BillingIndex = ({ current_user }) => {

  const searchParams = useSearchParams();
  const is_open = searchParams.get("is_open");
  // console.log(router)

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(is_open === "true" ? true : false);
  

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
    },
    {
      header: "Total Operations",
      accessorKey: "operation_count",
    },
    {
      header: "Used Credits",
      accessorKey: "used_operation_count",
    },
    {
      header: "Remaining Credits",
      accessorKey: "remaining_operation_count",
      cell: ({ row }) => {
        return <div>{row.original.operation_count - row.original.used_operation_count}</div>;
      },
    },
    {
      header: "Transaction Active From Date",
      accessorKey: "transaction_active_from_date",
    },
    {
      header: "Transaction Active To Date",
      accessorKey: "transaction_active_to_date",
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: ({ row }) => {
        return <div>{convertTime(row.original.created_at)}</div>;
      },
    },
  ];

  return (
    <DashboardPageLayout
      title="Billing"
      description="View your payment history and make a payment"
      button={
        <div className="space-x-2">
          <Button variant="secondary" onClick={() => setIsPaymentModalOpen(true)}><Plus className="h-4 w-4" /> Make Payment</Button>
        </div>
      }
    >
      <div className="space-y-6">
        <DataTable
          columns={columns}
          data={current_user?.user?.user_payment_transactions}
          showFilter={false}
          showPagination={false}
        />
      </div>
      <PaymentModal isOpen={isPaymentModalOpen} setIsOpen={setIsPaymentModalOpen} />
    </DashboardPageLayout>
  );
};

export default BillingIndex;
