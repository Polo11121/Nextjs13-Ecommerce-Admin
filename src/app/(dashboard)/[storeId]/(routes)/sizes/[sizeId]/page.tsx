import { SizeForm } from "@/sizes/components/SizeForm";
import prismaDB from "@/lib/prismaDB";

interface SizePageProps {
  params: {
    sizeId: string;
  };
}

const SizePage = async ({ params: { sizeId } }: SizePageProps) => {
  const size = await prismaDB.size.findFirst({
    where: {
      id: sizeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialSize={size} />
      </div>
    </div>
  );
};

export default SizePage;
