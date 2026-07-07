import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. جلب التقييمات من قاعدة البيانات
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { error: "فشل في جلب التقييمات" },
      { status: 500 },
    );
  }
}

// 2. إضافة تقييم جديد
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, rating, comment } = body;

    const newReview = await prisma.review.create({
      data: {
        name,
        rating: Number(rating),
        comment,
        date: new Date().toISOString().split("T")[0],
        // نضع قيمة افتراضية للـ userId لتجنب أي مشاكل بالربط مؤقتاً
      },
    });

    return NextResponse.json(newReview);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "فشل في إضافة التقييم" },
      { status: 500 },
    );
  }
}
