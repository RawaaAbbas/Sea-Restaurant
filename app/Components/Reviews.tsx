"use client";
import React from "react";
import { Star, Trash2, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

import { useLanguage } from "./LanguageContext";

const initialReviews = [
  {
    id: "1",
    name: "rawaa",
    rating: 5,
    commentAr: "ممتاز جداً والأكل طازج",
    commentEn: "goood",
    date: "2026-06-05",
  },
];

export default function Reviews() {
  const { lang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);

  // تعريف الـ State بالأنواع الصحيحة مع جعل القيمة الابتدائية مصفوفة فارغة مؤقتاً للسيرفر
  const [reviews, setReviews] = useState<
    {
      id: string;
      name: string;
      rating: number;
      commentAr: string;
      commentEn: string;
      date: string;
    }[]
  >([]);

  // تشغيل الإيفكت عند تحميل المتصفح فقط لقراءة الـ localStorage بأمان
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("local_reviews");
    if (saved) {
      setReviews(JSON.parse(saved));
    } else {
      setReviews(initialReviews);
    }
  }, []);

  const [comment, setComment] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  // 2. قراءة الرابط السري لـ isAdmin مباشرة كقيمة ابتدائية
  const [isAdmin, setIsAdmin] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.search.includes("reviews");
    }
    return false;
  });

  // دالة النشر مع الحفظ بالمتصفح
  const handlePublish = () => {
    if (!name.trim() || !comment.trim()) {
      alert(
        lang === "ar"
          ? "الرجاء كتابة الاسم والتعليق أولاً!"
          : "Please enter your name and review first!",
      );
      return;
    }

    const newReview = {
      id: Date.now().toString(),
      name: name,
      rating: rating,
      commentAr: comment,
      commentEn: comment,
      date: new Date().toISOString().split("T")[0],
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem("local_reviews", JSON.stringify(updatedReviews));

    setName("");
    setComment("");
    setRating(5);
  };

  // دالة الحذف
  // لما يضغط على أيقونة السلة، بس نفتح المودال ونخزن الـ id
  const handleDeleteClick = (id: string) => {
    setReviewToDelete(id);
    setIsModalOpen(true);
  };

  // دالة الحذف الفعلية لما يضغط "تأكيد" جوة المودال العصري
  const confirmDelete = () => {
    if (!reviewToDelete) return;

    const updatedReviews = reviews.filter(
      (review: { id: string }) => review.id !== reviewToDelete,
    );
    setReviews(updatedReviews);
    localStorage.setItem("local_reviews", JSON.stringify(updatedReviews));

    // نقفل المودال ونصفر الـ ID
    setIsModalOpen(false);
    setReviewToDelete(null);
  };

  // منع الـ React من رسم الواجهة قبل استقرار المتصفح وحل الـ Hydration
  if (!mounted) return null;

  return (
    <section id="reviews" className="py-16 px-6 bg-[#001B2E] relative">
      <div className="max-w-6xl mx-auto">
        {/* زر وضع الأدمن الفوق (متحرك يمين/يسار حسب اللغة) */}
        {/* ⚙️ زر وضع الأدمن بالوسط تماماً فوق الكروت */}

        {/* قسم العناوين الرئيسية */}
        <div className="text-center mb-12 space-y-2 pt-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            {lang === "ar" ? "آراء زبائننا" : "Customer Reviews"}
          </h2>
          <p className="text-gray-400 text-sm">
            {lang === "ar"
              ? "شاركونا تجاربكم ونفخر دائماً بخدمتكم"
              : "Share your experience with us, we are always proud to serve you"}
          </p>
        </div>

        {/* الـ Grid الأساسي وتحديد الاتجاه ديناميكياً */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-3 gap-8 ${lang === "ar" ? "direction-rtl" : "direction-ltr"}`}
        >
          {/* فورم ترك التقييم */}
          <div
            className={`bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl h-fit space-y-5 ${lang === "ar" ? "text-right" : "text-left"}`}
          >
            <h3 className="text-xl font-bold text-amber-500">
              {lang === "ar" ? "اترك رأيك وتجربتك" : "Leave Your Review"}
            </h3>

            {/* حقل الاسم */}
            <div className="space-y-1.5">
              <label className="block text-gray-300 text-xs font-semibold">
                {lang === "ar" ? "الاسم الكريم:" : "Full Name:"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  lang === "ar" ? "مثال: محمد البصري" : "e.g., rawaaa"
                }
                className={`w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#02C39A] transition-colors ${lang === "ar" ? "text-right" : "text-left"}`}
              />
            </div>

            {/* حقل النجوم التفاعلي */}
            <div className="space-y-1.5">
              <label className="block text-gray-300 text-xs font-semibold">
                {lang === "ar" ? "تقييمك للأكل:" : "Food Rating:"}
              </label>
              <div
                className={`flex gap-1 ${lang === "ar" ? "justify-end flex-row-reverse" : "justify-start"}`}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-xl transition-transform active:scale-90"
                  >
                    {star <= rating ? "⭐" : "☆"}
                  </button>
                ))}
              </div>
            </div>

            {/* حقل نص التقييم */}
            <div className="space-y-1.5">
              <label className="block text-gray-300 text-xs font-semibold">
                {lang === "ar"
                  ? "اكتب رأيك بالأكل والخدمة:"
                  : "How was your experience?"}
              </label>
              <textarea
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  lang === "ar"
                    ? "كيف كانت تجربتك لمأكولاتنا البحرية والنهرية؟"
                    : "Write your review here..."
                }
                className={`w-full px-4 py-3 bg-slate-950/60 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-[#02C39A] transition-colors resize-none ${lang === "ar" ? "text-right" : "text-left"}`}
              />
            </div>

            <button
              onClick={handlePublish}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/10 transition-all duration-200"
            >
              {lang === "ar" ? "أنشر تقييمي " : "Submit Review"}
            </button>
          </div>

          {/* 3️⃣ قائمة كروت التقييمات المعروضة (تعمل بالجهتين الآن دون اختفاء) */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-slate-900/30 border border-slate-800/60 p-5 rounded-2xl relative hover:border-slate-800 transition-colors"
              >
                {/* الهيدر */}
                <div
                  className={`flex items-center justify-between mb-2 ${lang === "ar" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`flex items-center gap-2 ${lang === "ar" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <span className="font-bold text-white text-base">
                      {review.name}
                    </span>

                    {/* سلة الحذف باللون الأحمر الفاقد المطلوبة */}
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteClick(review.id)}
                        className="text-red-400 hover:text-red-500 p-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-all duration-200"
                        title="حذف هذا التقييم"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <span className="text-gray-500 text-xs tracking-wider">
                    {review.date}
                  </span>
                </div>

                {/* عرض النجوم بحسب التقييم */}
                <div
                  className={`flex gap-0.5 mb-3 ${lang === "ar" ? "justify-end flex-row-reverse" : "justify-start"}`}
                >
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>

                {/* نص التعليق الذي يقرأ ديناميكياً حسب لغة الموقع الحالية */}
                <p
                  className={`text-gray-300 text-sm leading-relaxed ${lang === "ar" ? "text-right" : "text-left"}`}
                >
                  {lang === "ar" ? review.commentAr : review.commentEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🌟 مودال تأكيد الحذف العصري بنص الشاشة */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-[#001B2E] border border-[#118AB2]/20 p-6 rounded-2xl max-w-sm w-full mx-4 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* أيقونة تحذير زغيرة */}
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4 text-xl">
              ⚠️
            </div>

            <h3 className="text-white text-lg font-bold mb-2">تأكيد الحذف</h3>
            <p className="text-gray-400 text-sm mb-6">
              هل تريد تأكيد حذف هذا التقييم؟ لا يمكن التراجع عن هذا الإجراء
              لاحقاً.
            </p>

            {/* الأزرار العصرية */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-transparent border border-white/20 hover:bg-white/5 text-white font-medium rounded-xl text-sm transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl text-sm transition-colors shadow-lg shadow-red-600/20"
              >
                نعم، احذف
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
