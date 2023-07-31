"use client";

import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/Separator";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/DataTable";
import { billboardsColumns } from "@/billboards/utils/billboardsColumns";
import { ApiList } from "@/components/ui/ApiList";

interface BillboardsClientProps {
  billboards: BillboardsColumn[];
}

export const BillboardsClient = ({ billboards }: BillboardsClientProps) => {
  const router = useRouter();
  const params = useParams();

  const clickHandler = () => router.push(`/${params.storeId}/billboards/new`);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards {${billboards.length}}`}
          description="Manage billboards for you store"
        />
        <Button onClick={clickHandler}>
          <PlusIcon className="w-5 h-5" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={billboardsColumns}
        data={billboards}
        searchKey="label"
      />
      <Heading title="API" description="API calls for Billboards" />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  );
};
