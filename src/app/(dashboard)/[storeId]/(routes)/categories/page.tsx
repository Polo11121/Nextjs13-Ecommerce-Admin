import { format } from "date-fns";
import { CategoriesClient } from "@/categories/components/CategoriesClient";
import prismaDB from "@/lib/prismaDB";

const CategoriesPage = async ({ params: { storeId } }: StoreIdParams) => {
  const categories = await prismaDB.category.findMany({
    where: {
      storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCategories: CategoriesColumn[] = categories.map(
    (category) => ({
      id: category.id,
      name: category.name,
      billboardLabel: category.billboard.label,
      createdAt: format(new Date(category.createdAt), "MMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesClient categories={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
