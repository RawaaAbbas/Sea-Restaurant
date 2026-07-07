"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { signOut, useSession } from "next-auth/react";

export default function AdminSettings() {
  const router = useRouter();

  // حقول الـ State للتحكم بالبيانات
  const { data: session, status, update } = useSession();
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    console.log("STATUS:", status);
    console.log("SESSION:", session);
    if (status === "authenticated" && session?.user) {
      setAdminName(session.user.name || "");
      setAdminEmail(session.user.email || "");
    }
  }, [session, status]);

  // جلب البيانات من الـ localStorage بطريقة آمنة لـ React
  // جلب البيانات الحالية من الجلسة (Session) فور جاهزيتها
  // جلب البيانات فور استقرار الجلسة (Session)
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setAdminName(session.user.name || "");
      setAdminEmail(session.user.email || "");
    }
  }, [session, status]);

  // دالة تحديث الاسم الشخصي

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 1. إرسال البيانات للسيرفر (تأكدي من إرسال الاسم والإيميل)
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: adminName,
          email: adminEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "حدث خطأ أثناء التحديث");
      }

      // 2. تحديث الـ Client Session بأمان بدون اعتراض من الـ TypeScript
      if (typeof update === "function") {
        await update({
          name: adminName,
          email: adminEmail,
        });
      }

      setMessage({ type: "success", text: "تم تحديث البيانات الشخصية بنجاح!" });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "حدث خطأ أثناء تحديث الاسم",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-gray-100 flex items-center justify-center p-4"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        {/* رأس الصفحة */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👤</span>
            <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              إعدادات الحساب الشخصي
            </h1>
          </div>
          <Link
            href="/admin"
            className="text-xs text-gray-400 hover:text-amber-500 transition-colors"
          >
            رجوع للوحة ←
          </Link>
        </div>

        {/* رسائل النجاح أو الفشل */}
        {message && (
          <div
            className={`p-3 rounded-lg text-sm mb-4 text-center font-medium ${
              message.type === "success"
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* فورم تعديل الاسم والإيميل */}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">
              الاسم الحالي للأدمن
            </label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-amber-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">
              البريد الإلكتروني الحالي
            </label>
            <input
              type="email"
              disabled
              value={adminEmail}
              className="w-full bg-slate-950 border border-slate-800/50 rounded-xl px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-gray-100 py-2 rounded-xl text-sm transition-all font-medium"
          >
            {loading ? "جاري الحفظ..." : "تحديث الاسم الشخصي"}
          </button>
        </form>

        <hr className="border-slate-800 my-6" />

        {/* قسم تغيير كلمة المرور بصفحة منفصلة */}
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-200">
              كلمة المرور والأمان
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              تريد حماية حسابك؟ قم بتحديث الباسورد من هنا.
            </p>
          </div>

          <Link
            href="/admin/settings/change-password"
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold px-3 py-2 rounded-xl text-xs transition-all shadow-md"
          >
            🔑 تغيير الآن
          </Link>
        </div>

        <div className="mt-4 flex justify-start">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mt-4 ms-auto bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded..."
          >
            🚪 تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
}
