"use client";

import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { PlusIcon } from "lucide-react";
import { Separator } from "@/components/ui/Separator";
import { useParams, useRouter } from "next/navigation";
import { DataTable } from "@/components/ui/DataTable";
import { categoriesColumns } from "@/categories/utils/categoriesColumns";
import { ApiList } from "@/components/ui/ApiList";

interface CategoriesClientProps {
  categories: CategoriesColumn[];
}

export const CategoriesClient = ({ categories }: CategoriesClientProps) => {
  const router = useRouter();
  const params = useParams();

  const clickHandler = () => router.push(`/${params.storeId}/categories/new`);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories {${categories.length}}`}
          description="Manage categories for you store"
        />
        <Button onClick={clickHandler}>
          <PlusIcon className="w-5 h-5" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={categoriesColumns}
        data={categories}
        searchKey="name"
      />
      <Heading title="API" description="API calls for Categories" />
      <Separator />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
};
