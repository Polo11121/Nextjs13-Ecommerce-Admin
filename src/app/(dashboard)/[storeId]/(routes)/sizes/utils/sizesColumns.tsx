"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SizesCellAction } from "@/sizes/components/SizesCellAction";

export const sizesColumns: ColumnDef<SizesColumn>[] = [
  {
    accessorKey: "name",
    header: "name",
  },
  {
    accessorKey: "value",
    header: "value",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <SizesCellAction data={row.original} />,
  },
];
