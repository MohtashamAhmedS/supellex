import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import Cart from "@/models/Cart";
import Order from "@/models/Order";

export async function POST(req) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkoutSession = event.data.object;

    try {
      await connectDB();

      const userId = checkoutSession.metadata.userId;
      const cart = await Cart.findOne({ user: userId }).populate(
        "items.product",
      );

      if (cart && cart.items.length > 0) {
        const orderItems = cart.items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image,
        }));

        const totalPrice = checkoutSession.amount_total / 100;

        await Order.create({
          user: userId,
          items: orderItems,
          totalPrice,
          status: "pending",
          shippingAddress: checkoutSession.customer_details?.address || {},
        });

        cart.items = [];
        await cart.save();
      }
    } catch (error) {
      console.error("Error processing webhook:", error);
      return NextResponse.json(
        { error: "Webhook handler failed" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}
