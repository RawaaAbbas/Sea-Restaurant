import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // تأكدي إن مسار استدعاء prisma صحيح عندچ
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "يرجى ملء جميع الحقول" },
        { status: 400 },
      );
    }

    // التأكد من عدم وجود الإيميل مسبقاً
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "البريد الإلكتروني مستخدم بالفعل" },
        { status: 400 },
      );
    }

    // تشفير كلمة المرور
    const hashedPassword = await bcrypt.hash(password, 10);

    // إضافة الحساب بـ Neon
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    return NextResponse.json(
      { message: "تم إنشاء الحساب بنجاح", user: newUser },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "حدث خطأ بداخل السيرفر" },
      { status: 500 },
    );
  }
}
