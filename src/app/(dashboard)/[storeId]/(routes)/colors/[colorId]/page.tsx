import { ColorForm } from "@/colors/components/ColorForm";
import prismaDB from "@/lib/prismaDB";

interface ColorPageProps {
  params: {
    colorId: string;
  };
}

const ColorPage = async ({ params: { colorId } }: ColorPageProps) => {
  const color = await prismaDB.color.findFirst({
    where: {
      id: colorId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialColor={color} />
      </div>
    </div>
  );
};

export default ColorPage;
