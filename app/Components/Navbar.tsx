"use client";
import Link from "next/link";
import { useLanguage } from "./LanguageContext";

export default function Navbar() {
  const { lang, setLang } = useLanguage();

  // مصفوفة اللينكات لتسهيل التحكم بالـ Active والـ Hover
  const navLinks = [
    { id: "hero", nameAr: "الرئيسية", nameEn: "Home", href: "#hero" },
    { id: "menu", nameAr: "قائمة الطعام", nameEn: "Menu", href: "#menu" },
    {
      id: "reviews",
      nameAr: "آراء الزبائن",
      nameEn: "Reviews",
      href: "#reviews",
    },
    {
      id: "reserve",
      nameAr: "الحجوزات",
      nameEn: "Reservations",
      href: "#reserve",
    },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#001B2E]/90 backdrop-blur-md border-b border-[#118AB2]/10 px-6 py-4 transition-all duration-300">
      <div
        className="max-w-7xl mx-auto flex items-center justify-between"
        dir={lang === "ar" ? "rtl" : "ltr"}
      >
        {/* 1️⃣ اللوغو واسم المطعم
}

        {/* 1️⃣ اللوغو واسم المطعم: نفس الفونط والروح مالت باقي أزرار الـ Nav */}
        <Link
          href="#hero"
          className="flex items-center gap-2 text-[#D4AF37] hover:opacity-90 transition-opacity"
        >
          <span className="text-lg md:text-xl align-middle">⚓</span>

          {/* اسم المطعم: حجم أكبر (text-lg md:text-xl) ولون ذهبي ثابت */}
          <span className="text-lg md:text-xl font-bold tracking-normal text-[#D4AF37] transition-colors duration-200">
            {lang === "ar" ? "صيد الأعماق" : "Deep Sea"}
          </span>
        </Link>

        {/* 2️⃣ لينكات التنقل العصرية */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className="text-gray-300 hover:text-[#D4AF37] text-base md:text-lg transition-colors duration-200 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-[#D4AF37] hover:after:w-full after:transition-all after:duration-300"
            >
              {lang === "ar" ? link.nameAr : link.nameEn}
            </Link>
          ))}
        </div>

        {/* 3️⃣ زر تحويل اللغة العصري */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 text-gray-200 hover:text-[#D4AF37] text-sm font-semibold transition-all shadow-md"
          >
            🌐 {lang === "ar" ? "English" : "عربي"}
          </button>
        </div>
      </div>
    </nav>
  );
}
