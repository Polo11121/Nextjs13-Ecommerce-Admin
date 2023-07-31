import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismaDB from "@/lib/prismaDB";

interface Params {
  params: {
    storeId: string;
    colorId: string;
  };
}

export const GET = async (_req: Request, { params: { colorId } }: Params) => {
  try {
    if (!colorId) {
      return new NextResponse("Size Id is required", { status: 400 });
    }

    const color = await prismaDB.color.findUnique({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color, { status: 200 });
  } catch (error) {
    console.log(error, "COLOR_GET");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const PATCH = async (
  req: Request,
  { params: { colorId, storeId } }: Params
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

    if (!colorId) {
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

    const color = await prismaDB.color.updateMany({
      where: {
        id: colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color, { status: 200 });
  } catch (error) {
    console.log(error, "COLOR_PATCH");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const DELETE = async (
  _req: Request,
  { params: { storeId, colorId } }: Params
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!colorId) {
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

    const color = await prismaDB.color.deleteMany({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color, { status: 200 });
  } catch (error) {
    console.log(error, "COLOR_DELETE");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
