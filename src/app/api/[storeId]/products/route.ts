import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismaDB from "@/lib/prismaDB";

export const POST = async (
  req: Request,
  { params: { storeId } }: StoreIdParams
) => {
  try {
    const { userId } = auth();
    const {
      images,
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      isFeatured,
      isArchived,
    } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!images || !images.length) {
      return new NextResponse("Images are required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category Id is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size Id is required", { status: 400 });
    }

    if (!colorId) {
      return new NextResponse("Color Id is required", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const store = await prismaDB.store.findUnique({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!store) {
      return new NextResponse("Store not found", { status: 404 });
    }

    const product = await prismaDB.product.create({
      data: {
        images: {
          createMany: {
            data: [...images.map(({ url }: { url: string }) => ({ url }))],
          },
        },
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        isFeatured,
        isArchived,
        storeId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.log(error, "PRODUCTS_POST");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  _req: Request,
  { params: { storeId } }: StoreIdParams
) => {
  try {
    const { searchParams } = new URL(_req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const products = await prismaDB.product.findMany({
      where: {
        storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products, { status: 201 });
  } catch (error) {
    console.log(error, "PRODUCTS_GET");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
