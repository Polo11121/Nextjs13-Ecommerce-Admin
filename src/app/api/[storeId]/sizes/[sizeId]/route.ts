import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismaDB from "@/lib/prismaDB";

interface Params {
  params: {
    storeId: string;
    sizeId: string;
  };
}

export const GET = async (_req: Request, { params: { sizeId } }: Params) => {
  try {
    if (!sizeId) {
      return new NextResponse("Size Id is required", { status: 400 });
    }

    const size = await prismaDB.size.findUnique({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size, { status: 200 });
  } catch (error) {
    console.log(error, "SIZE_GET");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params: { sizeId, storeId } }: Params
) => {
  try {
    const { userId } = auth();
    const { name, value } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size Id is required", { status: 400 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
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

    const size = await prismaDB.size.updateMany({
      where: {
        id: sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size, { status: 200 });
  } catch (error) {
    console.log(error, "SIZE_PATCH");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  _req: Request,
  { params: { storeId, sizeId } }: Params
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!sizeId) {
      return new NextResponse("Size Id is required", { status: 400 });
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

    const size = await prismaDB.size.deleteMany({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size, { status: 200 });
  } catch (error) {
    console.log(error, "SIZE_DELETE");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
