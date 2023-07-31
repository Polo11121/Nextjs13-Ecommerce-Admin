import { UserButton, auth } from "@clerk/nextjs";
import { StoreSwitcher } from "@/components/StoreSwitcher";
import { MainNav } from "@/components/MainNav";
import prismaDB from "@/lib/prismaDB";

export const Navbar = async () => {
  const { userId } = auth();

  const stores = await prismaDB.store.findMany({
    where: {
      userId: userId as string,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};
