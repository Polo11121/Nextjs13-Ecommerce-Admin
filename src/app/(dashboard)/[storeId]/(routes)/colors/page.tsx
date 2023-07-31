import { ColorsClient } from "@/colors/components/ColorsClient";
import { format } from "date-fns";
import prismaDB from "@/lib/prismaDB";

const ColorsPage = async ({ params: { storeId } }: StoreIdParams) => {
  const colors = await prismaDB.color.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorsColumn[] = colors.map(
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
        <ColorsClient colors={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
