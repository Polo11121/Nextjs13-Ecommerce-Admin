import { BillboardsClient } from "@/billboards/components/BillboardsClient";
import { format } from "date-fns";
import prismaDB from "@/lib/prismaDB";

const BillboardsPage = async ({ params: { storeId } }: StoreIdParams) => {
  const billboards = await prismaDB.billboard.findMany({
    where: {
      storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardsColumn[] = billboards.map(
    (billboard) => ({
      id: billboard.id,
      label: billboard.label,
      createdAt: format(new Date(billboard.createdAt), "MMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardsClient billboards={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
