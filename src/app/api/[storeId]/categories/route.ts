import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismaDB from "@/lib/prismaDB";

export const POST = async (
  req: Request,
  { params: { storeId } }: StoreIdParams
) => {
  try {
    const { userId } = auth();
    const { name, billboardId } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
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

    const category = await prismaDB.category.create({
      data: {
        name,
        billboardId,
        storeId,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.log(error, "CATEGORIES_POST");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (
  _req: Request,
  { params: { storeId } }: StoreIdParams
) => {
  try {
    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const categories = await prismaDB.category.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(categories, { status: 201 });
  } catch (error) {
    console.log(error, "CATEGORIES_GET");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
