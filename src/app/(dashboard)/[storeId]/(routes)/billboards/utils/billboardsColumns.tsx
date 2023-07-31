"use client";

import { ColumnDef } from "@tanstack/react-table";
import { BillboardsCellAction } from "@/billboards/components/BillboardsCellAction";

export const billboardsColumns: ColumnDef<BillboardsColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <BillboardsCellAction data={row.original} />,
  },
];
