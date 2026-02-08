"use client";
import DataTable from "@/components/shared/clientDataTable";
import { Button } from "@/components/ui/button";
import DashboardPageLayout from "@/components/utils/DashboardPagelayout";
import { convertTime, convertToDate } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { EyeIcon } from "lucide-react";
import PaymentTransation from "./_builder/PaymentTransation";
import { useState } from "react";

const UsersIndex = ({ users }) => {
  const [isPaymentTransationOpen, setIsPaymentTransationOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  const columns = [
    {
      header: "Name",
      accessorKey: "first_name",
      cell: ({ row }) => (
        <>
          <div>
            {row.original.first_name} {row.original.last_name}
          </div>
          <div>
            {row.original.role_name}
          </div>
        </>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
      cell: ({ row }) => {
      return (
        <>
          <div className="">
            {row.original.phone}
          </div>
          <div className="">
            {row.original.email}
          </div>
        </>
      )}
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: ({ row }) => <div>{convertTime(row.original.created_at)}</div>,
    },
    {
      header: "Active Status",
      accessorKey: "role_name",
      cell: ({ row }) => {
        const last_transaction = row.original.user_payment_transactions[0];

        const formatDate = (date) => {
          return date ? convertToDate(date) : "N/A";
        }
        
        if (last_transaction) {
          return (
            <>
              <div>{last_transaction.transaction_status_name}</div>
              <div>{formatDate(last_transaction?.transaction_active_from_date)} - {formatDate(last_transaction?.transaction_active_to_date)}</div>
            </>
          )
        }
        return <div>No transaction found</div>
      }
    },
    {
      header: "Actions",
      accessorKey: "action",
      enableSorting: false,
      cell: ({ row }) => (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <EllipsisVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setIsPaymentTransationOpen(true);
                  setUserData(row.original);
                }}
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                Payments
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <DashboardPageLayout title="Users" description="Manage your users">
      <DataTable columns={columns} data={users.users} />
      <PaymentTransation isOpen={isPaymentTransationOpen} setIsOpen={setIsPaymentTransationOpen} userData={userData} />
    </DashboardPageLayout>
  );
};

export default UsersIndex;
