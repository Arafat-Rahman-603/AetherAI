import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Set from "@/models/set.model";

export async function POST(request: NextRequest) {
  try {
    const { userId, business, email, data, backendUrl } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 });
    }

    await connectDB();

    // Find user
    let user = await Set.findOne({ userId });

    const now = Date.now();
    let updatedProducts = user?.products || null;

    // Check if we need to fetch new products
    const needsFetch = backendUrl && (
      !user?.products ||
      user.backendUrl !== backendUrl ||
      user.products.lastUpdated + 86400000 < now
    );

    if (needsFetch) {
      // Fetch new products from backend
      try {
        const res = await fetch(backendUrl);
        const fetchedProducts = await res.json();

        let productList: { name?: string; title?: string; price?: string | number; amount?: string | number }[] = [];
        if (Array.isArray(fetchedProducts)) {
          productList = fetchedProducts;
        } else if (fetchedProducts && typeof fetchedProducts === "object") {
          const arrayProp = Object.values(fetchedProducts).find(val => Array.isArray(val));
          if (arrayProp) {
            productList = arrayProp as { name?: string; title?: string; price?: string | number; amount?: string | number }[];
          }
        }

        const productsData = productList.slice(0, 30).map((item: { name?: string; title?: string; price?: string | number; amount?: string | number }) => ({
          name: item?.name || item?.title || "No Name",
          price: item?.price || item?.amount || 0,
        }));

        updatedProducts = {
          data: productsData,
          lastUpdated: now,
        };
      } catch (err) {
        console.error("Product fetch error:", err);
      }
    } else if (!backendUrl) {
      updatedProducts = null;
    }

    user = await Set.findOneAndUpdate(
      { userId },
      { business, email, data, backendUrl, products: updatedProducts },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { message: "Set created/updated successfully", set: user },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
    try {
        const userId = request.nextUrl.searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        await connectDB();
        
        const set = await Set.findOne({ userId });
        
        return NextResponse.json(
            { message: "Set fetched successfully", set },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
