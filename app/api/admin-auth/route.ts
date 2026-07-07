import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email, password, name, isLogin } = await request.json();

    // 1️⃣ أولاً: إذا كانت العملية تسجيل دخول (Sign In / Log In)
    if (isLogin) {
      const existingAdmin = await prisma.admin.findUnique({ where: { email } });

      if (!existingAdmin || existingAdmin.password !== password) {
        return NextResponse.json(
          { error: "الإيميل أو كلمة المرور غير صحيحة" },
          { status: 401 },
        );
      }

      // 👇 ترجيع بيانات الاسم والصورة للمتصفح عند نجاح الدخول
      return NextResponse.json(
        {
          message: "تم تسجيل الدخول بنجاح",
          admin: {
            email: existingAdmin.email,
            name: existingAdmin.name || "أدمن مطعم صيد الأعماق",
            image:
              existingAdmin.image ||
              "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          },
        },
        { status: 200 },
      );
    }

    // 2️⃣ ثانياً: إذا كانت العملية إنشاء حساب لأول مرة (Sign Up / Register)
    const emailExists = await prisma.admin.findUnique({ where: { email } });
    if (emailExists) {
      return NextResponse.json(
        { error: "هذا الإيميل مسجل مسبقاً، سجل دخولك" },
        { status: 400 },
      );
    }

    // نحفظ الحساب الجديد في Neon
    const newAdmin = await prisma.admin.create({
      data: { email, password, name }, // إذا ضفتِ حقل الاسم بالـ Schema تكدرين تضيفين name هنا
    });

    return NextResponse.json(
      { message: "تم إنشاء الحساب بنجاح", admin: newAdmin },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ في السيرفر" }, { status: 500 });
  }
}
