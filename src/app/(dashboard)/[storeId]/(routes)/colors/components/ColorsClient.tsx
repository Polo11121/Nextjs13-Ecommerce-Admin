"use client";

import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/Separator";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/DataTable";
import { colorsColumns } from "@/colors/utils/colorsColumns";
import { ApiList } from "@/components/ui/ApiList";

interface ColorsClientProps {
  colors: ColorsColumn[];
}

export const ColorsClient = ({ colors }: ColorsClientProps) => {
  const router = useRouter();
  const params = useParams();

  const clickHandler = () => router.push(`/${params.storeId}/colors/new`);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors {${colors.length}}`}
          description="Manage colors for you store"
        />
        <Button onClick={clickHandler}>
          <PlusIcon className="w-5 h-5" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={colorsColumns} data={colors} searchKey="name" />
      <Heading title="API" description="API calls for Colors" />
      <Separator />
      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  );
};
