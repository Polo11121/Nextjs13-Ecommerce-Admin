import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismaDB from "@/lib/prismaDB";

interface Params {
  params: {
    storeId: string;
    categoryId: string;
  };
}

export const GET = async (
  _req: Request,
  { params: { categoryId } }: Params
) => {
  try {
    if (!categoryId) {
      return new NextResponse("Category Id is required", { status: 400 });
    }

    const category = await prismaDB.category.findUnique({
      where: {
        id: categoryId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log(error, "CATEGORY_GET");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params: { categoryId, storeId } }: Params
) => {
  try {
    const { userId } = auth();
    const { name, billboardId } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
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

    const category = await prismaDB.category.updateMany({
      where: {
        id: categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log(error, "CATEGORY_PATCH");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  _req: Request,
  { params: { storeId, categoryId } }: Params
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!categoryId) {
      return new NextResponse("Category Id is required", { status: 400 });
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

    const category = await prismaDB.category.deleteMany({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.log(error, "CATEGORY_DELETE");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
