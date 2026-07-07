import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params; // أضف await هنا
    await prisma.review.delete({
      where: { id: id },
    });
    return NextResponse.json({ message: "تم حذف التقييم بنجاح" });
  } catch (error) {
    return NextResponse.json({ error: "فشل في حذف التقييم" }, { status: 500 });
  }
}
