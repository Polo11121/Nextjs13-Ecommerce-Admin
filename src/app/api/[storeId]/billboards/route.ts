import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismaDB from "@/lib/prismaDB";

export const POST = async (
  req: Request,
  { params: { storeId } }: StoreIdParams
) => {
  try {
    const { userId } = auth();
    const { imageUrl, label } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }

    if (!imageUrl) {
      return new NextResponse("Image is required", { status: 400 });
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

    const billboard = await prismaDB.billboard.create({
      data: {
        label,
        imageUrl,
        storeId,
      },
    });

    return NextResponse.json(billboard, { status: 201 });
  } catch (error) {
    console.log(error, "BILLBOARDS_POST");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (_req: Request, { params: { storeId } }: Params) => {
  try {
    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    const billboards = await prismaDB.billboard.findMany({
      where: {
        storeId,
      },
    });

    return NextResponse.json(billboards, { status: 201 });
  } catch (error) {
    console.log(error, "BILLBOARDS_GET");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
