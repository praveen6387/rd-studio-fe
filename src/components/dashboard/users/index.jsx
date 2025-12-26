"use client";
import DataTable from "@/components/shared/clientDataTable";
import DashboardPageLayout from "@/components/utils/DashboardPagelayout";
import { convertToDate } from "@/lib/utils";

const UsersIndex = ({ users }) => {
  console.log(users);
  const columns = [
    {
      header: "Name",
      accessorKey: "first_name",
      cell: ({ row }) => (
        <div>
          {row.original.first_name} {row.original.last_name}
        </div>
      ),
    },
    {
      header: "Email",
      accessorKey: "email",
    },
    {
      header: "Phone",
      accessorKey: "phone",
    },
    {
      header: "Role",
      accessorKey: "role",
      cell: ({ row }) => <div className="capitalize">{row.original.role_name}</div>,
    },
    {
      header: "Created At",
      accessorKey: "created_at",
      cell: ({ row }) => <div>{convertToDate(row.original.created_at)}</div>,
    },
  ];
  return (
    <DashboardPageLayout title="Users" description="Manage your users">
      <DataTable columns={columns} data={users.users} />
    </DashboardPageLayout>
  );
};

export default UsersIndex;
