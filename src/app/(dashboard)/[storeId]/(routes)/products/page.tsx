import { ProductsClient } from "@/products/components/ProductsClient";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import prismaDB from "@/lib/prismaDB";

const ProductsPage = async ({ params: { storeId } }: StoreIdParams) => {
  const products = await prismaDB.product.findMany({
    where: {
      storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductsColumn[] = products.map(
    ({
      id,
      name,
      isFeatured,
      isArchived,
      price,
      category,
      color,
      size,
      createdAt,
    }) => ({
      id,
      name,
      isFeatured,
      isArchived,
      price: formatter.format(price.toNumber()),
      category: category.name,
      size: size.name,
      color: color.value,
      createdAt: format(new Date(createdAt), "MMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient products={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
