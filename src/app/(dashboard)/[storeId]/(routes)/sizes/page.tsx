import { SizesClient } from "@/sizes/components/SizesClient";
import { format } from "date-fns";
import prismaDB from "@/lib/prismaDB";

const SizesPage = async ({ params: { storeId } }: StoreIdParams) => {
  const sizes = await prismaDB.size.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSizes: SizesColumn[] = sizes.map(
    ({ id, name, value, createdAt }) => ({
      id,
      name,
      value,
      createdAt: format(new Date(createdAt), "MMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient sizes={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
