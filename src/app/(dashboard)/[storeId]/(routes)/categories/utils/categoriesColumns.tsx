"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CategoriesCellAction } from "@/categories/components/CategoriesCellAction";

export const categoriesColumns: ColumnDef<CategoriesColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({ row }) => row.original.billboardLabel,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CategoriesCellAction data={row.original} />,
  },
];
