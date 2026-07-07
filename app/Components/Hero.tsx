"use client";

import React from "react";
import { useLanguage } from "./LanguageContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  const { lang, setLang } = useLanguage();
  return (
    <section
      id="hero"
      className="relative w-full min-h-[85vh] bg-[#001B2E] flex items-center justify-center overflow-hidden pt-16"
    >
      {/* شبكة محاذاة العناصر (نص باليمين والصور باليسار) */}
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
        {/* النصوص والترحيب */}
        <div
          className={`flex flex-col ${lang === "ar" ? "items-end text-right" : "items-start text-left"} space-y-6 w-full`}
        >
          <p
            className={`text-[#D4AF37] font-semibold text-lg md:text-base tracking-wide animate-pulse w-full block ${
              lang === "ar"
                ? "text-right ml-auto mr-0"
                : "text-left mr-auto ml-0"
            }`}
          >
            {lang === "ar"
              ? "طازج من شباكنا إلى مائدتكم"
              : "Fresh from our nets to your table"}
          </p>

          <h1
            className={`text-4xl md:text-5xl font-bold text-white ${lang === "ar" ? "text-right" : "text-left"} space-y-3 w-full`}
          >
            <span className="block leading-tight">
              {lang === "ar" ? "مرحباً بكم في" : "Welcome to"}
            </span>
            <span className="block text-[#D4AF37] mt-2 leading-tight">
              {lang === "ar" ? "مطعم صيد الأعماق" : "Deep Sea Restaurant"}
            </span>
          </h1>
          <p
            dir={lang === "ar" ? "rtl" : "ltr"}
            className={`text-gray-300 text-base md:text-lg  max-w-xl leading-relaxed w-full block  ${
              lang === "ar"
                ? "text-right ml-auto mr-0"
                : "text-left mr-auto ml-0"
            }`}
          >
            {lang === "ar"
              ? "نأخذكم في رحلة تذوق فريدة بين أعماق البحر وعطايا النهر الصافية. نقدم لكم أجود أنواع الأسماك والمأكولات البحرية الطازجة يومياً بطهي يشغف ويُقدم بفخامة."
              : "We take you on a unique tasting journey between the depths of the sea and the pure gifts of the river. We offer you the finest types of fresh fish and seafood daily, cooked with passion and served with luxury."}
          </p>

          {/* 🚀 الأزرار: تقلب اتجاهها بالكامل حسب اللغة */}
          {/* 🚀 الأزرار: تتطابق بالملي مع اتجاه ومحاذاة البراغراف */}
          <div
            className={`flex gap-4 items-center mt-6 w-full ${
              lang === "ar"
                ? "justify-start ml-auto mr-0 text-right"
                : "justify-start mr-auto ml-0 text-left"
            }`}
          >
            {/* زر احجز طاولتك الآن */}
            <Link href="#reserve" passHref>
              <Button className="w-44 bg-[#D4AF37] hover:bg-[#b8962e] text-[#001B2E] font-bold rounded-xl py-3">
                {lang === "ar" ? "احجز طاولتك الآن" : "Book Your Table Now"}
              </Button>
            </Link>

            {/* زر استكشف المنيو */}
            <Link href="#menu" passHref>
              <Button className="w-44 bg-transparent hover:bg-white/5 border border-white/20 text-white font-bold rounded-xl py-3">
                {lang === "ar" ? "استكشف المنيو" : "Explore Menu"}
              </Button>
            </Link>
          </div>
        </div>

        {/* عرض الصور المميزة لأشهر أكلات المطعم */}
        <div className="relative grid grid-cols-2 gap-4">
          {/* خلفية ضوئية مائية خلف الصور */}
          <div className="absolute inset-0 bg-[#118AB2]/10 rounded-full blur-3xl -z-10" />

          {/* بوكس الصورة الأولى (مثلاً: السمك المسقوف) */}
          <div className="bg-[#073B4C]/40 border border-[#118AB2]/20 p-2 rounded-2xl shadow-xl transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300">
            <div className="aspect-square bg-[#001B2E] rounded-xl flex items-center justify-center text-gray-400 text-xs p-4 text-center border border-dashed border-[#118AB2]/30">
              <Image
                src="/image/fish.jpg"
                alt="مسقوف"
                width={400}
                height={300}
                priority={false} // يخليها تتحمل بذكاء وما تثقل الصفحة بالبداية
                className="object-cover rounded-2xl"
              />
            </div>
            <p className="text-[#D4AF37] text-xs font-bold text-center mt-2">
              {lang === "ar"
                ? "مسقوف بغدادي أصيل"
                : "Authentic Baghdadi Masgouf"}
            </p>
          </div>

          {/* بوكس الصورة الثانية (مثلاً: جمبري جامبو) */}
          <div className="bg-[#073B4C]/40 border border-[#118AB2]/20 p-2 rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 mt-6">
            <div className="aspect-square bg-[#001B2E] rounded-xl flex items-center justify-center text-gray-400 text-xs p-4 text-center border border-dashed border-[#118AB2]/30">
              <Image
                src="/image/shrimp2.jpg"
                alt="روبيان"
                width={400}
                height={300}
                priority={false} // يخليها تتحمل بذكاء وما تثقل الصفحة بالبداية
                className="object-cover rounded-2xl "
              />
            </div>
            <p className="text-[#D4AF37] text-xs font-bold text-center mt-2">
              {lang === "ar" ? "روبيان جامبو مشوي" : "Grilled Jumbo Shrimp"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
