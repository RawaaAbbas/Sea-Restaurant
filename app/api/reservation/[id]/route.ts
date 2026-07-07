import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - جلب حجز واحد
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const reservation = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reservation) {
      return NextResponse.json({ error: "الحجز غير موجود" }, { status: 404 });
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("خطأ في GET:", error);
    return NextResponse.json({ error: "خطأ في السيرفر" }, { status: 500 });
  }
}

// PATCH - تحديث حالة الحجز
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["pending", "confirmed", "canceled"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "حالة غير صالحة" }, { status: 400 });
    }

    const updated = await prisma.reservation.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ reservation: updated }, { status: 200 });
  } catch (error) {
    console.error("خطأ في PATCH:", error);
    return NextResponse.json({ error: "فشل تحديث الحجز" }, { status: 500 });
  }
}
