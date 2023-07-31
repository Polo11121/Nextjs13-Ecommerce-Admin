import prismaDB from "@/lib/prismaDB";
import { SettingsForm } from "@/app/(dashboard)/[storeId]/(routes)/settings/components/SettingsForm";
import { Store } from "@prisma/client";

const SettingsPage = async ({ params: { storeId } }: StoreIdParams) => {
  const store = (await prismaDB.store.findFirst({
    where: {
      id: storeId,
    },
  })) as Store;

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialStore={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
