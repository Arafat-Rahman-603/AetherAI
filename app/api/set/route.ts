import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Set from "@/models/set.model";

export async function POST(request: NextRequest) {
    try {
        const { userId, business, email, data } = await request.json();

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        await connectDB();
        
        const set = await Set.findOneAndUpdate(
            { userId },
            { business, email, data },
            { upsert: true, new: true }
        );
        
        return NextResponse.json(
            { message: "Set created successfully", set },
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
