type BillboardsColumn = {
  id: string;
  label: string;
  createdAt: string;
};

type CategoriesColumn = {
  id: string;
  name: string;
  billboardLabel: string;
  createdAt: string;
};

type SizesColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

type ColorsColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

type ProductsColumn = {
  id: string;
  name: string;
  isFeatured: boolean;
  isArchived: boolean;
  price: any;
  category: string;
  size: string;
  color: string;
  createdAt: string;
};

type OrdersColumn = {
  id: string;
  phone: string;
  address: string;
  products: string;
  totalPrice: string;
  createdAt: string;
  isPaid: boolean;
};

type StoreIdParams = {
  params: {
    storeId: string;
  };
};
