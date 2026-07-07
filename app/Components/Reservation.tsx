"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useLanguage } from "./LanguageContext";
import { translations } from "./locale";

export default function Reservation() {
  const { lang } = useLanguage();
  const t = translations[lang];
  const router = useRouter();
  // حالات الستيت لحفظ مدخلات الزبون بشكل حي
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    guests: "",
    dateTime: "",
    notes: "",
  });

  // حساب الوقت الحالي ومنع اختيار أي وقت أو تاريخ قديم
  const minDateTime = new Date(
    new Date().getTime() - new Date().getTimezoneOffset() * 60000,
  )
    .toISOString()
    .slice(0, 16);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // إرسال البيانات إلى السيرفر (الـ API)
      const response = await fetch("/api/reservation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // التوجيه الفوري لصفحة العداد بناءً على المعرف الراجع من السيرفر
        if (data && data.id) {
          router.push(`/reservation-status/${data.id}`);
        } else if (data && data.reservation && data.reservation.id) {
          router.push(`/reservation-status/${data.reservation.id}`);
        }
        setFormData({
          name: "",
          phone: "",
          guests: "",
          dateTime: "",
          notes: "",
        });
      } else {
        alert(data.error || "حدث خطأ ما");
      }
    } catch (error) {
      console.error(error);
      alert("فشل الاتصال بالسيرفر، تأكدي من الإنترنت");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="reserve"
      className="w-full py-24 bg-[#001B2E] relative overflow-hidden"
    >
      {/* تأثير خلفية مائية ناعمة */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00A896]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto bg-[#012A4A]/40 backdrop-blur-md border border-[#00A896]/20 p-8 md:p-12 rounded-3xl shadow-2xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* القسم الأيمن: نصوص ترحيبية */}
            {/* نصوص ترحيبية للقسم الأيمن */}
            <div
              className={`space-y-6 ${lang === "ar" ? "text-right" : "text-left"}`}
              dir={lang === "ar" ? "rtl" : "ltr"}
            >
              <h2 className="text-4xl font-extrabold text-white tracking-tight">
                {lang === "ar" ? "احجر طاولتك" : "Book Your Table"}{" "}
                <span className="text-[#02C39A]">
                  {lang === "ar" ? "الملكية" : "The Royal"}
                </span>
              </h2>

              <p className="text-gray-300 text-lg leading-relaxed">
                {lang === "ar"
                  ? "يسرنا استقبالكم في صيد الأعماق، يرجى ملء النموذج، وسيقوم فريقنا بتأكيد حجزكم في غضون 15 دقيقة."
                  : "We are pleased to welcome you to Deep Sea. Please fill out the form, and our team will confirm your reservation within 15 minutes."}
              </p>

              <div className="pt-4 space-y-4 border-t border-[#00A896]/10 text-gray-400 text-sm">
                {/* الموقع */}
                <div
                  className={`flex items-center gap-3 ${lang === "ar" ? "justify-end flex-row-reverse" : "justify-start"}`}
                >
                  <span className="text-[#02C39A]">📍</span>
                  <span>
                    {lang === "ar" ? "بغداد - المنصور" : "Baghdad - Al-Mansour"}
                  </span>
                </div>

                {/* الهاتف */}
                <div
                  className={`flex items-center gap-3 ${lang === "ar" ? "justify-end flex-row-reverse" : "justify-start"}`}
                >
                  <span className="text-[#02C39A]">📞</span>
                  <span dir="ltr">0000 000 780 964+</span>
                </div>

                {/* الوقت */}
                <div
                  className={`flex items-center gap-3 ${lang === "ar" ? "justify-end flex-row-reverse" : "justify-start"}`}
                >
                  <span className="text-[#02C39A]">⏰</span>
                  <span>
                    {lang === "ar"
                      ? "يومياً: 12:00 م - 12:00 ص"
                      : "Daily: 12:00 PM - 12:00 AM"}
                  </span>
                </div>
              </div>
            </div>

            {/* القسم الأيسر: الاستمارة الحقيقية */}
            <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
              <div className="space-y-2 text-right">
                <label className="text-gray-200 mr-1 block text-sm font-medium">
                  {t.name}
                </label>
                <Input
                  type="text"
                  placeholder={t.name}
                  className="w-full px-4 py-3 rounded-xl bg-[#001B2E]/50 border border-[#00A896]/20 text-white placeholder-gray-500 focus:border-[#02C39A] focus:ring-1 focus:ring-[#02C39A] transition-all text-right"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4"></div>
              <div className="space-y-2 text-right">
                <label className="text-gray-200 mr-1 block text-sm font-medium">
                  {t.guests}
                </label>
                <Input
                  type="number"
                  placeholder={t.guests}
                  min="1"
                  className="w-full px-4 py-3 rounded-xl bg-[#001B2E]/50 border border-[#00A896]/20 text-white placeholder-gray-500 focus:border-[#02C39A] focus:ring-1 focus:ring-[#02C39A] transition-all text-right"
                  value={formData.guests}
                  onChange={(e) =>
                    setFormData({ ...formData, guests: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2 text-right">
                <label className="text-gray-200 mr-1 block text-sm font-medium">
                  {t.phone}
                </label>
                <Input
                  type="tel"
                  placeholder={t.phone}
                  className="w-full px-4 py-3 rounded-xl bg-[#001B2E]/50 border border-[#00A896]/20 text-white placeholder-gray-500 focus:border-[#02C39A] focus:ring-1 focus:ring-[#02C39A] transition-all text-right"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2 text-right">
                <label className="text-gray-200 mr-1 block text-sm font-medium">
                  {t.dateTime}
                </label>
                <Input
                  suppressHydrationWarning
                  type="datetime-local"
                  className="w-full px-4 py-3 rounded-xl bg-[#001B2E]/50 border border-[#00A896]/20 text-white focus:border-[#02C39A] focus:ring-1 focus:ring-[#02C39A] transition-all text-right"
                  value={formData.dateTime}
                  onChange={(e) =>
                    setFormData({ ...formData, dateTime: e.target.value })
                  }
                  required
                  min={minDateTime}
                />
              </div>

              <div className="space-y-2 text-right">
                <label className="text-gray-200 mr-1 block text-sm font-medium">
                  {t.notes}
                </label>
                <textarea
                  placeholder={t.notes}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-[#001B2E]/50 border border-[#00A896]/20 text-white placeholder-gray-500 focus:border-[#02C39A] focus:ring-1 focus:ring-[#02C39A] transition-all text-right resize-none text-sm"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-[#02C39A] hover:bg-[#00A896] text-[#001B2E] font-bold text-lg shadow-lg hover:shadow-[#02C39A]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t.loading : t.submit}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
