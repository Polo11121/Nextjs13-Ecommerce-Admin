"use client";

import { Heading } from "@/components/ui/Heading";
import { Separator } from "@/components/ui/Separator";
import { DataTable } from "@/components/ui/DataTable";
import { ordersColumns } from "@/orders/utils/ordersColumns";

interface OrdersClientProps {
  orders: OrdersColumn[];
}

export const OrdersClient = ({ orders }: OrdersClientProps) => (
  <>
    <Heading
      title={`Orders {${orders.length}}`}
      description="Manage orders for you store"
    />
    <Separator />
    <DataTable columns={ordersColumns} data={orders} searchKey="products" />
  </>
);
