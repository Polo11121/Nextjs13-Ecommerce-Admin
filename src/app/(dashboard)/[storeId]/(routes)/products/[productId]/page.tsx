import { ProductForm } from "@/products/components/ProductForm";
import prismaDB from "@/lib/prismaDB";

interface ProductPageProps {
  params: {
    productId: string;
  };
}

const ProductPage = async ({ params: { productId } }: ProductPageProps) => {
  const product = await prismaDB.product.findFirst({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  });
  const categories = await prismaDB.category.findMany({
    where: {
      storeId: product?.storeId,
    },
  });
  const colors = await prismaDB.color.findMany({
    where: {
      storeId: product?.storeId,
    },
  });
  const sizes = await prismaDB.size.findMany({
    where: {
      storeId: product?.storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialProduct={product}
          categories={categories}
          sizes={sizes}
          colors={colors}
        />
      </div>
    </div>
  );
};

export default ProductPage;
