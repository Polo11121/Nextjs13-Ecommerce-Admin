"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ColorsCellAction } from "@/colors/components/ColorsCellAction";

export const colorsColumns: ColumnDef<ColorsColumn>[] = [
  {
    accessorKey: "name",
    header: "name",
  },
  {
    accessorKey: "value",
    header: "value",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.value}
        <div
          className=" h-2 w-6 rounded-full border"
          style={{ backgroundColor: row.original.value }}
        />
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <ColorsCellAction data={row.original} />,
  },
];
