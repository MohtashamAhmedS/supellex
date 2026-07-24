import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import Cart from "@/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const cart = await Cart.findOne({ user: session.user.id }).populate(
      "items.product",
    );

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Cart is empty" },
        { status: 400 },
      );
    }

    const line_items = cart.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.name,
          images: item.product.image
            ? [`${process.env.NEXT_PUBLIC_BASE_URL}${item.product.image}`]
            : [],
        },
        unit_amount: Math.round(item.product.price * 100),
      },
      quantity: item.quantity,
    }));

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
      },
    });

    return NextResponse.json({ success: true, url: checkoutSession.url });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}
