import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import prismaDB from "@/lib/prismaDB";
import Stripe from "stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export const OPTIONS = async () =>
  NextResponse.json({}, { headers: corsHeaders });

export const POST = async (
  req: Request,
  { params: { storeId } }: StoreIdParams
) => {
  try {
    const { productIds } = await req.json();

    if (!storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }

    if (!productIds || !productIds.length) {
      return new NextResponse("Product Ids are required", { status: 400 });
    }

    const products = await prismaDB.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      products.map((product) => ({
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price.toNumber() * 100,
        },
      }));

    const order = await prismaDB.order.create({
      data: {
        storeId,
        isPaid: false,
        orderItems: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
      metadata: {
        orderId: order.id,
      },
    });

    return NextResponse.json(
      { url: session.url },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.log(error, "CHECKOUT_POST");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
