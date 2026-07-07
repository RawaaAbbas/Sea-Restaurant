"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ReservationStatusPage() {
  const { id } = useParams();
  const [status, setStatus] = useState<"pending" | "confirmed" | "canceled">(
    "pending",
  );
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(600); // 10 دقائق بالثواني

  // ⏱️ العداد التنازلي: ينقص ثانية واحدة كل ثانية
  useEffect(() => {
    if (timeLeft <= 0 || status !== "pending") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, status]);

  // 🔄 الفحص الدوري التلقائي (Polling): يسأل السيرفر عن القرار كل 15 ثانية
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/reservation/${id}`);
        if (response.ok) {
          const data = await response.json();

          // قراءة الـ status مباشرة لأن السيرفر يرسل الحجز فوراً ككائن مستقل
          if (data && data.status) {
            setStatus(data.status);
          }
        }
      } catch (error) {
        console.error("❌ خطأ أثناء فحص حالة الحجز:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();

    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, [id]);

  // دالة تحويل الثواني إلى صيغة مقروءة ومفصولة (09:45)
  const formatTime = (seconds: number) => {
    if (seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    const displayMins = mins.toString().padStart(2, "0");
    const displaySecs = secs.toString().padStart(2, "0");

    return `${displayMins}:${displaySecs}`;
  };

  if (loading) {
    return (
      <div
        className="flex h-screen items-center justify-center bg-slate-900 font-sans text-lg text-slate-300"
        dir="rtl"
      >
        ⚓ جاري قراءة تفاصيل الحجز الملكي من صيد الأعماق...
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 font-sans text-right"
      dir="rtl"
    >
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-8 shadow-2xl border border-slate-800 text-center">
        {/* ⏳ التصميم الأول: قيد الانتظار (Pending) */}
        {status === "pending" && (
          <div>
            <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
            <h1 className="text-2xl font-bold text-white mb-2">
              طلبك قيد المراجعة الملكيه⚓
            </h1>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              يقوم طاقم مطعم صيد الأعماق حالياً بتدقيق الطاولات المتوفرة لتأكيد
              حجزكِ خلال ربع ساعة.
            </p>

            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <span className="text-xs text-cyan-400 block mb-1 font-semibold">
                الوقت الأقصى المتوقع للرد
              </span>
              <span className="text-3xl font-mono font-bold text-cyan-400">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        )}

        {/* ✅ التصميم الثاني: تم القبول (Confirmed) */}
        {status === "confirmed" && (
          <div className="animate-fade-in">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-950 text-3xl text-emerald-400 border border-emerald-500/30">
              ✅
            </div>
            <h1 className="text-2xl font-bold text-emerald-400 mb-2">
              تم تأكيد حجزكِ بنجاح! 🎉
            </h1>
            <p className="text-slate-300 my-4 font-medium">
              أهلاً بكِ في مطعم صيد الأعماق الملكي.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              تم ترتيب طاولتكِ الفخمة ونحن بانتظار تشريفكِ لنا في الوقت المحدد.
              سهرة ممتعة!
            </p>
          </div>
        )}

        {/* ❌ التصميم الثالث: تم الإلغاء أو الرفض (Canceled) */}
        {status === "canceled" && (
          <div className="animate-fade-in">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-950 text-3xl text-rose-400 border border-rose-500/30">
              🚫
            </div>
            <h1 className="text-2xl font-bold text-rose-400 mb-2">
              نعتذر منكِ بشدة!
            </h1>
            <p className="text-slate-300 my-4 font-medium">
              لم نتمكن من تأكيد الحجز في الوقت الحالي.
            </p>
            <p className="text-slate-400 text-sm leading-relaxed">
              نظراً للامتلاء الكامل لجميع الطاولات، نسعد بتشريفكِ لنا في وقت آخر
              أو التواصل مع الإدارة مباشرة.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
