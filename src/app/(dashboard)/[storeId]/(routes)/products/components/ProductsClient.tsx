"use client";

import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/Separator";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/DataTable";
import { productsColumns } from "@/products/utils/productsColumns";
import { ApiList } from "@/components/ui/ApiList";

interface ProductsClientProps {
  products: ProductsColumn[];
}

export const ProductsClient = ({ products }: ProductsClientProps) => {
  const router = useRouter();
  const params = useParams();

  const clickHandler = () => router.push(`/${params.storeId}/products/new`);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products {${products.length}}`}
          description="Manage products for you store"
        />
        <Button onClick={clickHandler}>
          <PlusIcon className="w-5 h-5" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={productsColumns} data={products} searchKey="name" />
      <Heading title="API" description="API calls for Products" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};
