import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismaDB from "@/lib/prismaDB";

export const POST = async (
  req: Request,
  { params: { storeId } }: StoreIdParams
) => {
  try {
    const { userId } = auth();
    const { name, value } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!value) {
      return new NextResponse("Value is required", { status: 400 });
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

    const size = await prismaDB.size.create({
      data: {
        name,
        value,
        storeId,
      },
    });

    return NextResponse.json(size, { status: 201 });
  } catch (error) {
    console.log(error, "SIZES_POST");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (_req: Request, { params: { storeId } }: Params) => {
  try {
    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const sizes = await prismaDB.size.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(sizes, { status: 201 });
  } catch (error) {
    console.log(error, "SIZES_GET");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
