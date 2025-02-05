import { NextResponse } from "next/server";

export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const userId = searchParams.get("userId");
  
      if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
      }
  
      // Fetch orders for the user, including product details
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          products: {
            include: {
              product: true, // Include full product details
            },
          },
        },
        orderBy: {
          createdAt: 'desc', // Sort orders by date (newest first)
        },
      });
  
      return NextResponse.json({ orders }, { status: 200 });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
  }