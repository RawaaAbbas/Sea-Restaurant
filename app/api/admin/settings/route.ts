import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface AdminWithPassword {
  id: string;
  name: string;
  email: string;
  password?: string | null;
}

export async function PUT(req: Request) {
  try {
    const { currentPassword, newPassword, newName } = await req.json();

    // 1. نحاول نجيب أول حساب موجود بجدول الـ user
    let admin = await prisma.admin.findFirst();

    // 2. إذا الجدول فارغ تماماً وما بيه أي حساب، نسوي حساب جديد فوراً بالبيانات الممررة!
    if (!admin) {
      admin = await prisma.admin.create({
        data: {
          name: newName || "أدمن مطعم صيد الأعماق",
          email: "admin@restaurant.com",
          password: newPassword || currentPassword,
          role: "admin",
        },
      });

      return NextResponse.json({
        message: "تم إنشاء حساب الإدارة وتحديث البيانات بنجاح!",
      });
    }

    // 3. إذا الحساب موجود، نشيك الباسورد الحالي

    if (
      currentPassword &&
      (admin as AdminWithPassword).password !== currentPassword
    ) {
      return NextResponse.json(
        { error: "كلمة المرور الحالية غير صحيحة" },
        { status: 400 },
      );
    }

    // 4. تحديث البيانات للحساب الموجود
    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        name: newName || admin.name,
        password: newPassword || (admin as AdminWithPassword).password,
      },
    });

    return NextResponse.json({ message: "تم تحديث الإعدادات بنجاح!" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "حدث خطأ غير متوقع";
    console.error("API Error: ", errorMessage);
    return NextResponse.json(
      { error: "حدث خطأ أثناء معالجة البيانات بالخادم" },
      { status: 500 },
    );
  }
}
