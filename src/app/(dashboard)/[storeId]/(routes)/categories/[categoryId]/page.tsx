import { CategoryForm } from "@/categories/components/CategoryForm";
import prismaDB from "@/lib/prismaDB";

interface CategoryPageProps {
  params: {
    categoryId: string;
    storeId: string;
  };
}

const CategoryPage = async ({
  params: { categoryId, storeId },
}: CategoryPageProps) => {
  const category = await prismaDB.category.findFirst({
    where: {
      id: categoryId,
    },
  });

  const billboards = await prismaDB.billboard.findMany({
    where: {
      storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialCategory={category} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPage;
