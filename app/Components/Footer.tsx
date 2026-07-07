"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";

export default function Footer() {
  const { lang } = useLanguage();

  return (
    <footer
      className="bg-[#011125] border-t border-slate-900 pt-12 pb-6 text-white"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        {/* 🧩 شبكة الأقسام الثلاثة */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800/50 ${lang === "ar" ? "text-right" : "text-left"}`}
        >
          {/* 1️⃣ القسم الأول: عن المطعم */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold tracking-wide">
              {lang === "ar" ? "صيد" : "Deep"}{" "}
              <span className="text-[#02C39A]">
                {lang === "ar" ? "الأعماق" : "Sea"}
              </span>
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              {lang === "ar"
                ? "تجربة طعام بحرية ملكية تأخذكم في رحلة إلى أعماق النكهات البغدادية والبحرية الأصيلة على ضفاف شط العرب."
                : "A royal marine dining experience taking you on a journey into the depths of authentic Baghdadi and seafood flavors on the banks of Shatt Al-Arab."}
            </p>
          </div>

          {/* 2️⃣ القسم الثاني: أوقات العمل */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold border-b border-[#02C39A]/20 pb-1 inline-block">
              {lang === "ar" ? "أوقات العمل" : "Opening Hours"}
            </h4>
            <p className="text-gray-300 text-xs pt-1 font-semibold">
              {lang === "ar"
                ? "يومياً: 12:00 م - 12:00 ص"
                : "Daily: 12:00 PM - 12:00 AM"}
            </p>
            <p className="text-gray-500 text-[11px]">
              {lang === "ar"
                ? "صالة العوائل مفتوحة طيلة أيام الأسبوع"
                : "The family lounge is open throughout the week"}
            </p>
          </div>

          {/* 3️⃣ القسم الثالث: روابط سريعة */}
          {/* القسم الثالث: روابط سريعة */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-lg border-b-2 border-[#D4AF37] w-fit ">
              {lang === "ar" ? "روابط سريعة" : "Quick Links"}
            </h3>

            <div className="flex flex-col space-y-2 text-sm">
              <a href="#" className="hover:text-[#D4AF37] transition-colors">
                {lang === "ar" ? "الرئيسية" : "Home"}
              </a>

              <a
                href="#menu"
                className="hover:text-[#D4AF37] transition-colors"
              >
                {lang === "ar" ? "قائمة الطعام" : "Menu"}
              </a>

              <a
                href="#reserve"
                className="hover:text-[#D4AF37] transition-colors"
              >
                {lang === "ar" ? "احجز طااولتك" : "Book Your Table"}
              </a>
            </div>
          </div>
        </div>

        {/* 🔒 القسم السفلي: حقوق النشر والديزاين */}
        <div className="pt-6 text-center text-gray-500 text-[11px] space-y-1.5">
          <p>
            &copy; {new Date().getFullYear()}{" "}
            <span className="text-gray-400 font-medium">
              {lang === "ar" ? "مطعم صيد الأعماق" : "Deep Sea Restaurant"}
            </span>
            {lang === "ar" ? " جميع الحقوق محفوظة." : " .All rights reserved."}
          </p>
          <p className="text-gray-600 italic">
            {lang === "ar"
              ? "صمم بكل فخامة ليناسب ذوقكم الملكي."
              : "Designed with supreme luxury to suit your royal taste."}
          </p>
        </div>
      </div>
    </footer>
  );
}
