"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "كلمة المرور الجديدة وتأكيدها غير متطابقين!",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "حدث خطأ ما");

      setMessage({
        type: "success",
        text: "تم تغيير كلمة المرور بنجاح! جاري إعادتك...",
      });
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        router.push("/admin/settings");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "حدث خطأ غير متوقع";
      setMessage({ type: "error", text: errorMessage });
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
        {/* العودة للخلف */}
        <div className="mb-4">
          <Link
            href="/admin/settings"
            className="text-xs text-amber-500 hover:underline flex items-center gap-1"
          >
            ← العودة لإعدادات الحساب
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl">🔒</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            تغيير كلمة المرور
          </h1>
        </div>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">
              كلمة المرور الحالية <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <hr className="border-slate-800/60 my-2" />

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">
              كلمة المرور الجديدة <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              value={formData.newPassword}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
              placeholder="تتكون من 6 أرقام أو حروف على الأقل"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-amber-500 transition-colors mb-3"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">
              تأكيد كلمة المرور الجديدة <span className="text-rose-500">*</span>
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="إعادة كتابة الباسورد الجديدة"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-orange-500/10 disabled:opacity-50"
          >
            {loading ? "جاري التحديث بأمان..." : "تحديث كلمة المرور"}
          </button>
        </form>
      </div>
    </div>
  );
}
