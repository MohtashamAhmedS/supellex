import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Cart from "@/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// GET cart for logged in user
export async function GET() {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Please login to view cart" },
        { status: 401 },
      );
    }

    const cart = await Cart.findOne({ user: session.user.id }).populate(
      "items.product",
      "name price image",
    );

    return NextResponse.json({ success: true, data: cart || { items: [] } });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch cart" },
      { status: 500 },
    );
  }
}

// POST — add item to cart
export async function POST(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Please login to add to cart" },
        { status: 401 },
      );
    }

    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 },
      );
    }

    let cart = await Cart.findOne({ user: session.user.id });

    if (!cart) {
      // No cart yet — create one
      cart = await Cart.create({
        user: session.user.id,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Cart exists — check if product already in cart
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId,
      );

      if (existingItem) {
        // Already in cart — increase quantity
        existingItem.quantity += quantity;
      } else {
        // Not in cart — add it
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    return NextResponse.json(
      { success: true, message: "Added to cart", data: cart },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add to cart" },
      { status: 500 },
    );
  }
}

// DELETE — remove item from cart
export async function DELETE(req) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Please login" },
        { status: 401 },
      );
    }

    const { productId } = await req.json();

    const cart = await Cart.findOne({ user: session.user.id });
    if (!cart) {
      return NextResponse.json(
        { success: false, message: "Cart not found" },
        { status: 404 },
      );
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    return NextResponse.json({
      success: true,
      message: "Item removed",
      data: cart,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to remove item" },
      { status: 500 },
    );
  }
}
