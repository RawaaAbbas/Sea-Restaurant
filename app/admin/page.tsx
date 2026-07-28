"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

interface Reservation {
  id: string;
  name: string;
  phone: string;
  guests: number;
  date?: string; // اختياري
  time?: string; // اختياري
  dateTime?: string | Date; // أضيفي هذا السطر هنا لتختفي الخطوط تماماً
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [prevPendingCount, setPrevPendingCount] = useState<number | null>(null);
  const { data: session, status } = useSession();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const adminName = session?.user?.name || "مدير النظام";
  const adminImage =
    typeof window !== "undefined"
      ? localStorage.getItem("adminImage") ||
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  const handleBulkDelete = async () => {
    try {
      const res = await fetch("/api/reservation", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });

      if (res.ok) {
        setSelectedIds([]); // تصفير المصفوفة
        setShowConfirmModal(false); // إغلاق النافذة
        router.refresh(); // تحديث البيانات بالصفحة
      } else {
        alert("حدث خطأ أثناء الحذف");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 🚀 دالة تحديث حالة الحجز في قاعدة البيانات عبر السيرفر
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // 1. رجعنا المسار العادي بدون الـ id بداخل الـ URL
      const response = await fetch(`/api/reservation/${id}`, {
        // 2. غيرنا الـ Method من PATCH إلى POST
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        // تحديث الحجوزات داخل الواجهة فوراً بدون الحاجة لتحديث الصفحة بالكامل
        setReservations((prev: Reservation[]) =>
          prev.map((res) =>
            res.id === id ? { ...res, status: newStatus } : res,
          ),
        );
      } else {
        alert("فشل تحديث حالة الحجز بالسيرفر");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    // async function checkAuthAndGetReservations() {
    //   try {
    //     const isAuthenticated = localStorage.getItem("isAdminAuthenticated");
    //     if (!isAuthenticated) {
    //       router.push("/login");
    //       return;
    //     }

    //     const res = await fetch("/api/reservation", { cache: "no-store" });

    async function checkAuthAndGetReservations() {
      try {
        if (status === "unauthenticated") {
          router.push("/login");
          return;
        }
        if (status !== "authenticated") {
          return;
        }

        const res = await fetch("/api/reservation", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const incomingReservations = data.reservations || [];

          // ⏳ ترتيب من الأحدث للأقدم بناءً على تاريخ التقديم
          // const sortedReservations = incomingReservations.sort(
          //   (a: Reservation, b: Reservation) => {
          //     return (
          //       new Date(b.createdAt).getTime() -
          //       new Date(a.createdAt).getTime()
          //     );
          //   },
          // );

          const sortedReservations = incomingReservations.sort(
            (a: Reservation, b: Reservation) => {
              const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return timeB - timeA;
            },
          );

          // حساب عدد الحجوزات الحالية التي حالتها "pending"
          const currentPending = incomingReservations.filter(
            (res: Reservation) => res.status === "pending",
          );

          // 🔥 مقارنة: إذا زاد عدد الحجوزات المعلقة عن المرة السابقة.. شغل التنبيه الفوري!
          if (
            prevPendingCount !== null &&
            currentPending.length > prevPendingCount
          ) {
            const audio = new Audio(
              "https://assets.mixkit.co/active_storage/sfx/2869/2869-500.wav",
            );
            audio
              .play()
              .catch((err) => console.log("الصوت يحتاج تفاعل أولاً:", err));
          }

          setReservations(incomingReservations);
          setPrevPendingCount(currentPending.length);
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    }

    // طلب إذن الإشعارات من المتصفح
    // طلب إذن الإشعارات من المتصفح لكي تظهر على الشاشة
    if (
      typeof window !== "undefined" &&
      Notification.permission === "default"
    ) {
      Notification.requestPermission();
    }

    // استدعاء الدالة فوراً عند فتح الصفحة
    checkAuthAndGetReservations();

    // ⏳ فحص تلقائي ودوري كل 5 ثوانٍ بالخلفية بدون ريفريش
    const interval = setInterval(checkAuthAndGetReservations, 5000);
    return () => clearInterval(interval);
  }, [prevPendingCount, router, status]);

  async function updateStatus(id: string, newStatus: string) {
    try {
      const res = await fetch(`/api/reservation/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setReservations((prev) =>
          prev.map((resv) =>
            resv.id === id ? { ...resv, status: newStatus } : resv,
          ),
        );
      } else {
        alert("فشلت عملية تحديث الحالة، حاول مجدداً!");
      }
    } catch (error) {
      console.error("خطأ أثناء التعديل:", error);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white text-xl">
        جاري تحميل الحجوزات... ⚓
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-8"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-cyan-500/30 pb-4">
          ⚓ لوحة إدارة حجز الطاولات - مطعم صيد الأعماق
        </h1>

        {/* 📦 حاوية تجمع البروفايل وزر تسجيل الخروج سوا على اليسار */}
        <div className="flex items-center gap-4 justify-start mb-6 dir-ltr">
          <Link
            href="/admin/settings"
            // className="p-4    h-full align-middle w-full"
            className="flex items-center gap-3 font-medium text-white p-2.5 px-5  bg-slate-900/60 hover:bg-slate-800/70 border border-slate-700/40 rounded-xl shadow-md transition-all duration-300 backdrop-blur-md cursor-pointer group"
          >
            {/* صورة المدير */}
            <img
              src={adminImage}
              alt="profile"
              className="w-10 h-10 rounded-full border border-cyan-500/80 object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* معلومات المدير - ناعمة وواضحة مع اتساع بالعرض */}
            <div className="flex flex-col items-start gap-0.5 text-right">
              {/* الاسم - ناعم ومتناسق */}
              <h3 className="text-slate-100 font-medium text-[13px] leading-tight antialiased tracking-normal group-hover:text-cyan-400 transition-colors duration-300">
                {adminName}
              </h3>
              {/* الرتبة - واضحة ومريحة */}
            </div>
          </Link>
        </div>

        {/* 📊 كروت الإحصائيات الذكية بأعلى اللوحة */}
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 text-right"
          dir="rtl"
        >
          <div
            onClick={() => setStatusFilter("all")}
            className="bg-slate-800 p-4 rounded-xl border border-slate-700 cursor-pointer hover:border-slate-500 transition-all"
          >
            <p className="text-slate-400 text-sm">إجمالي حجوزات اليوم</p>
            <p className="text-2xl font-bold text-white mt-1">
              {reservations.length}
            </p>
          </div>

          <div
            onClick={() => setStatusFilter("pending")}
            className="bg-slate-800 p-4 rounded-xl border border-slate-700 cursor-pointer hover:border-slate-500 transition-all"
          >
            <p className="text-teal-400 text-sm">بانتظار الموافقة ⏳</p>

            <p className="text-2xl font-bold text-teal-300 mt-1">
              {
                reservations.filter((r: Reservation) => {
                  const status = r.status?.toString().toLowerCase().trim();
                  return (
                    status === "pending" ||
                    r.status === "قيد الانتظار" ||
                    !r.status ||
                    status === ""
                  );
                }).length
              }
            </p>
          </div>

          <div
            onClick={() => setStatusFilter("confirmed")}
            className="bg-slate-800 p-4 rounded-xl border border-slate-700 cursor-pointer hover:border-slate-500 transition-all"
          >
            <p className="text-emerald-400 text-sm">الحجوزات المقبولة 🎉</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {
                reservations.filter(
                  (r: Reservation) =>
                    r.status === "accepted" ||
                    r.status === "confirmed" ||
                    r.status === "approved" ||
                    r.status === "success" ||
                    r.status === "مقبول" ||
                    r.status === "تم التاكيد",
                ).length
              }
            </p>
          </div>

          {/* الكرت 4: الحجوزات المرفوضة (الجديد) */}
          <div
            onClick={() => setStatusFilter("canceled")}
            className="bg-slate-800 p-4 rounded-xl border border-slate-700 cursor-pointer hover:border-slate-500 transition-all"
          >
            <p className="text-rose-400 text-sm">الحجوزات المرفوضة 🚫</p>
            <p className="text-2xl font-bold text-rose-400 mt-1">
              {
                reservations.filter(
                  (r: Reservation) =>
                    r.status === "rejected" ||
                    r.status === "canceled" ||
                    r.status === "مرفوض" ||
                    r.status === "ملغي",
                ).length
              }
            </p>
          </div>
        </div>

        {/* زر الحذف الجماعي - يظهر فقط إذا تم تحديد حجز واحد أو أكثر */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-slate-800 p-3 rounded-xl mb-4 border border-slate-700">
            <span className="text-white text-sm font-medium">
              تم تحديد {selectedIds.length} حجز
            </span>
            <button
              onClick={() => setShowConfirmModal(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-xs transition-all"
            >
              حذف المحدّد 🗑️
            </button>
          </div>
        )}

        {/* نافذة تأكيد الحذف (Modal) */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl max-w-sm w-full text-center shadow-2xl">
              <h3 className="text-lg font-bold text-white mb-2">تأكيد الحذف</h3>
              <p className="text-slate-400 text-xs mb-6">
                هل أنتِ متأكدة من حذف {selectedIds.length} حجز؟ لا يمكن التراجع
                عن هذا الإجراء.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-md font-bold text-xs transition-all"
                >
                  نعم، احذف
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-2 rounded-md font-bold text-xs transition-all"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-cyan-400 border-b border-slate-800 text-sm font-semibold">
                <th className="p-4 text-right">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length === reservations.length &&
                      reservations.length > 0
                    }
                    onChange={() => {
                      if (selectedIds.length === reservations.length) {
                        setSelectedIds([]);
                      } else {
                        setSelectedIds(
                          reservations.map((res: Reservation) => res.id),
                        );
                      }
                    }}
                    className="w-4 h-4 rounded cursor-pointer accent-cyan-500"
                  />
                </th>
                <th className="p-4">الاسم</th>
                <th className="p-4">الهاتف</th>
                <th className="p-4">عدد الأفراد</th>
                <th className="p-4">التاريخ والوقت</th>
                <th className="p-4 text-teal-400">وقت تقديم الحجز</th>
                <th className="p-4 text-center">حالة الحجز</th>
                <th className="p-4 text-center">إجراءات التحكم</th>
              </tr>
            </thead>
            <tbody className="text-slate-300 divide-y divide-slate-800/50 text-sm">
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    لا توجد أي حجوزات مسجلة حالياً.
                  </td>
                </tr>
              ) : (
                reservations
                  .filter(
                    (res: Reservation) =>
                      statusFilter === "all" || res.status === statusFilter,
                  )
                  .map((res: Reservation) => (
                    <tr
                      key={res.id}
                      className={`${
                        res.status === "pending"
                          ? "animate-pulse bg-teal-950/30 border-r-4 border-r-teal-500 text-teal-200"
                          : "hover:bg-slate-800/20"
                      } border-b border-slate-800/50 transition-all duration-300`}
                    >
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(res.id)}
                          onChange={() => {
                            if (selectedIds.includes(res.id)) {
                              setSelectedIds(
                                selectedIds.filter((id) => id !== res.id),
                              );
                            } else {
                              setSelectedIds([...selectedIds, res.id]);
                            }
                          }}
                          className="w-4 h-4 rounded cursor-pointer accent-cyan-500"
                        />
                      </td>
                      <td className="p-4 font-medium text-white flex items-center h-full align-middle w-full">
                        <span className="w-1/2 text-right self-center">
                          {res.name}
                        </span>
                        <div className="w-1/2 flex justify-start pl-8 items-center">
                          {res.status === "pending" && (
                            <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-1 rounded animate-pulse tracking-wider">
                              NEW
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-medium text-white text-right align-middle">
                        {/* الحاوية الإجمالية أصبحت gap-4 لتعطي مسافة مثالية بين الأزرار والرقم */}
                        <div
                          className="inline-flex items-center gap-4"
                          dir="ltr"
                        >
                          {/* 🟢 الأزرار وبينهما مسافة ناعمة gap-2 */}
                          <div className="flex items-center gap-2">
                            {/* زر الواتساب */}
                            <a
                              href={`https://wa.me/${res.phone}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-xs"
                              title="مراسلة عبر الواتساب"
                            >
                              💬
                            </a>

                            {/* زر الاتصال */}
                            <a
                              href={`tel:${res.phone}`}
                              className="p-1 rounded bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 transition-colors text-xs"
                              title="اتصال هاتفي"
                            >
                              📞
                            </a>
                          </div>

                          {/* رقم الهاتف محافظ على مكانه ومحاذاته جهة اليمين */}
                          <span className="font-mono text-sm text-slate-300">
                            {res.phone}
                          </span>
                        </div>
                      </td>

                      {/* <td className="p-4">{res.phone}</td> */}
                      <td className="p-4 text-cyan-400 font-bold">
                        {res.guests}
                      </td>

                      {/* 📅 عمود تاريخ الزيارة بالتنسيق الإنجليزي الفخم */}
                      <td className="p-4 text-right">
                        {res.dateTime ? (
                          <div className="flex flex-col gap-1 font-sans">
                            {/* التاريخ: Jun 3, 2026 */}
                            <span className="text-white font-semibold text-sm">
                              {new Date(res.dateTime).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </span>
                            {/* الوقت: 09:30 PM */}
                            <span className="text-cyan-400 font-bold text-base tracking-wide ">
                              {new Date(res.dateTime).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                },
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-sm">
                            Not set
                          </span>
                        )}
                      </td>

                      {/* 🕒 عمود وقت إرسال الطلب بالتنسيق الإنجليزي المكبر والبارز */}
                      <td className="p-4 text-right">
                        {res.createdAt ? (
                          <div className="flex flex-col gap-1 font-sans">
                            {/* التاريخ: 06/03/2026 */}
                            <span className="text-slate-200 font-medium text-sm">
                              {new Date(res.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "2-digit",
                                  day: "2-digit",
                                  year: "numeric",
                                },
                              )}
                            </span>
                            {/* الوقت بالدقيقة: 02:35 AM */}
                            <span className="text-amber-400 font-bold text-base tracking-wide">
                              {new Date(res.createdAt).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                },
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-sm">N/A</span>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            res.status === "confirmed"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : res.status === "canceled"
                                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {res.status === "confirmed"
                            ? "مقبول ✓"
                            : res.status === "canceled"
                              ? "مرفوض ✗"
                              : "قيد الانتظار •"}
                        </span>
                      </td>

                      {/* 🕹️ عمود إجراءات التحكم - حسم نهائي (إما أزرار أو نص القرار) */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* الحالة 1: إذا كان الحجز مقبولاً، تختفي الأزرار ويظهر نص "تم القبول" فقط */}
                          {res.status === "confirmed" ||
                          res.status === "accepted" ||
                          res.status === "approved" ||
                          res.status === "مقبول" ? (
                            <span className="text-emerald-400 font-bold text-sm bg-emerald-950/40 px-3 py-1 rounded-md border border-emerald-800/50">
                              تم القبول ✓
                            </span>
                          ) : /* الحالة 2: إذا كان الحجز مرفوضاً، تختفي الأزرار ويظهر نص "تم الرفض" فقط */
                          res.status === "canceled" ||
                            res.status === "rejected" ||
                            res.status === "مرفوض" ? (
                            <span className="text-rose-400 font-bold text-sm bg-rose-950/40 px-3 py-1 rounded-md border border-rose-800/50">
                              تم الرفض ✕
                            </span>
                          ) : (
                            /* الحالة 3: إذا كان قيد الانتظار، تظهر أزرار التحكم الطبيعية ليتخذ الأدمن قراراً */
                            <>
                              <button
                                onClick={() =>
                                  handleStatusChange(res.id, "confirmed")
                                }
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs px-3 py-1 rounded-md transition-colors"
                              >
                                قبول
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(res.id, "canceled")
                                }
                                className="bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs px-3 py-1 rounded-md transition-colors"
                              >
                                رفض
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
