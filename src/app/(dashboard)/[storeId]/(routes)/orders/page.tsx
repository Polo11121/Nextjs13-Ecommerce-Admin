import { OrdersClient } from "@/orders/components/OrdersClient";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";
import prismaDB from "@/lib/prismaDB";

const OrdersPage = async ({ params: { storeId } }: StoreIdParams) => {
  const orders = await prismaDB.order.findMany({
    where: {
      storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrdersColumn[] = orders.map(
    ({ id, phone, address, orderItems, createdAt, isPaid }) => ({
      id,
      phone,
      address,
      products: orderItems.map(({ product }) => product.name).join(", "),
      totalPrice: formatter.format(
        orderItems.reduce((acc, { product }) => acc + Number(product.price), 0)
      ),
      isPaid,
      createdAt: format(new Date(createdAt), "MMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrdersClient orders={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
