import { BillboardForm } from "@/billboards/components/BillboardForm";
import prismaDB from "@/lib/prismaDB";

interface BillboardPageProps {
  params: {
    billboardId: string;
  };
}

const BillboardPage = async ({
  params: { billboardId },
}: BillboardPageProps) => {
  const billboard = await prismaDB.billboard.findFirst({
    where: {
      id: billboardId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialBillboard={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
