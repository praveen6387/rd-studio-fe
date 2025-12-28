import DataTable from "@/components/shared/clientDataTable";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { convertTime } from "@/lib/utils";

const PaymentTransation = ({ isOpen, setIsOpen, userData }) => {
  console.log(userData);
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
      header: "Transaction Active From Date",
      accessorKey: "transaction_active_from_date",
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
    <div>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-[90vw] sm:max-w-5xl">
          <SheetHeader>
            <SheetTitle>Payments for {userData?.id}</SheetTitle>
          </SheetHeader>
          <div>
            <DataTable
              columns={columns}
              data={userData?.user_payment_transactions}
              showFilter={false}
              showPagination={false}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PaymentTransation;
