"use client";

import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/Separator";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/DataTable";
import { sizesColumns } from "@/sizes/utils/sizesColumns";
import { ApiList } from "@/components/ui/ApiList";

interface SizesClientProps {
  sizes: SizesColumn[];
}

export const SizesClient = ({ sizes }: SizesClientProps) => {
  const router = useRouter();
  const params = useParams();

  const clickHandler = () => router.push(`/${params.storeId}/sizes/new`);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes {${sizes.length}}`}
          description="Manage sizes for you store"
        />
        <Button onClick={clickHandler}>
          <PlusIcon className="w-5 h-5" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={sizesColumns} data={sizes} searchKey="name" />
      <Heading title="API" description="API calls for Sizes" />
      <Separator />
      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
};
