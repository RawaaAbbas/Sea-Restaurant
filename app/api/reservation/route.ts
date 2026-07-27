import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const prisma = new PrismaClient();

// 1. دالة الـ POST لإرسال وتثبيت الحجز الجديد
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, guests, dateTime, notes } = body;

    // فحص المدخلات الأساسية
    if (!name || !phone || !guests || !dateTime) {
      return NextResponse.json(
        { error: "الرجاء ملء جميع الحقول المطلوبة الكريمة" },
        { status: 400 },
      );
    }

    // إدخال البيانات في قاعدة البيانات
    const newReservation = await prisma.reservation.create({
      data: {
        name,
        phone,
        guests: parseInt(guests),
        dateTime: new Date(dateTime),
        notes: notes || null,
      },
    });

    return NextResponse.json(
      {
        message: "تم تثبيت حجزكِ بنجاح في صيد الأعماق! 🌊⚓",
        reservation: newReservation,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("خطأ أثناء تسجيل الحجز:", error);
    return NextResponse.json(
      { error: "حدث خطأ في السيرفر أثناء تسجيل الحجز" },
      { status: 500 },
    );
  }
}

// 2. دالة الـ GET المعزولة تماماً لجلب الحجوزات لصاحب المطعم
export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: {
        createdAt: "desc", // عرض الأحدث دائماً في الأعلى
      },
    });

    return NextResponse.json({ reservations }, { status: 200 });
  } catch (error) {
    console.error("خطأ في جلب الحجوزات:", error);
    return NextResponse.json(
      { error: "فشل السيرفر في جلب الحجوزات" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { ids } = await request.json();
    await prisma.reservation.deleteMany({
      where: { id: { in: ids } },
    });
    return NextResponse.json({ message: "تم حذف الحجوزات بنجاح" });
  } catch (error) {
    return NextResponse.json({ error: "فشل في الحذف" }, { status: 500 });
  }
}
