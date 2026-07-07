"use client";

import { useLanguage } from "./LanguageContext";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function Menu() {
  const { lang, setLang } = useLanguage();

  // مصفوفة البيانات (الأكلات) مرتبة ونظيفة لتسهيل التعديل مستقبلاً
  const menuItems = [
    {
      id: "1",
      name:
        lang === "ar"
          ? "صالونة هامور بالحموضة البحرية"
          : "Sour Seafood Hamour Stew",
      category: "sea",
      price: lang === "ar" ? "22,000 د.ع" : "22,000 IQD",
      ingredients:
        lang === "ar"
          ? "قطع سمك هامور بحري طازج مطبوخة بمرقة الطماطم الطازجة مع الثوم المكثف، الكزبرة الخضراء، ولمسة التمر الهندي للحموضة البحرية الشهيرة."
          : "Fresh sea Hamour chunks cooked in a rich tomato broth with intense garlic, fresh coriander, and a touch of tamarind for that famous coastal sourness.",
    },
    {
      id: "2",
      name:
        lang === "ar"
          ? "مطلب روبيان الخليج الفاخر"
          : "Premium Gulf Shrimp Mutabbaq",
      category: "sea",
      price: lang === "ar" ? "18,000 د.ع" : "18,000 IQD",
      ingredients:
        lang === "ar"
          ? "روبيان طازج محمس مع البصل والشبت والكزبرة والبهارات البحرية الفواحة، يقدم مع أرز بسمتي معطر بالهيل والزعفران."
          : "Fresh Gulf shrimp sautéed with onions, dill, coriander, and aromatic sea spices, served over fragrant basmati rice infused with cardamom and saffron.",
    },
    {
      id: "3",
      name: lang === "ar" ? "سمك شعري مقلي مقرمش" : "Crispy Fried Shaari Fish",
      category: "sea",
      price: lang === "ar" ? "16,000 د.ع" : "16,000 IQD",
      ingredients:
        lang === "ar"
          ? "سمك شعري بحري طازج متبل بالخلطة السرية (كاري، كركم، ثوم، وليمون)، مقلي بالزيت الحار حتى مقرمش بلونه الذهبي."
          : "Fresh sea Shaari fish marinated in our secret blend (curry, turmeric, garlic, and lemon), deep-fried to golden, extra-crispy perfection.",
    },
    {
      id: "4",
      name:
        lang === "ar"
          ? "مطبق زبيدي بصري أصيل"
          : "Authentic Basra Zubaidi Mutabbaq",
      category: "sea",
      price: lang === "ar" ? "35,000 د.ع" : "35,000 IQD",
      ingredients:
        lang === "ar"
          ? "سمك زبيدي بحري طازج (ملك الخليج) يقدم فوق أرز بسمتي فاخر مطبوخ بماء طبخ السمك مع الحشو المقرمش الفاخر ولمسة بهارات المطبق البصرية."
          : "Fresh sea Zubaidi fish (King of the Gulf) served over premium basmati rice cooked in fish broth, topped with crispy stuffing and a touch of authentic Basra spices.",
    },
    {
      id: "5",
      name:
        lang === "ar"
          ? "صبور محشي مشوي عالتنور"
          : "Stuffed Grilled Suboor on Tannour",
      category: "sea",
      price: lang === "ar" ? "25,000 د.ع" : "25,000 IQD",
      ingredients:
        lang === "ar"
          ? "سمك صبور بحري طازج محشي بالحشو البصري التقليدي (ثوم، كزبرة، خضار، تمر هندي، وبهارات حارة) ومشوي بالتنور على الأصول."
          : "Fresh sea Suboor fish stuffed with traditional Basra filling (garlic, coriander, herbs, tamarind, and hot spices), perfectly grilled in a traditional Tannour oven.",
    },
    {
      id: "6",
      name:
        lang === "ar"
          ? "طاجن أخطبوط ومحار السي فود"
          : "Seafood Octopus & Clam Tajine",
      category: "sea",
      price: lang === "ar" ? "28,000 د.ع" : "28,000 IQD",
      ingredients:
        lang === "ar"
          ? "قطع أخطبوط طرية مع محار البحر مطبوخة داخل طاجن فخاري مع فلفل الألوان، كريمة الطبخ اللذيذة وجبن الموزاريلا الذايب."
          : "Tender octopus pieces and fresh sea clams cooked in a clay pot with bell peppers, rich cooking cream, and melted mozzarella cheese.",
    },
    {
      id: "7",
      name:
        lang === "ar"
          ? "مطبق بني نهري بالهيل"
          : "River Bunni Mutabbaq with Cardamom",
      category: "river",
      price: lang === "ar" ? "32,000 د.ع" : "32,000 IQD",
      ingredients:
        lang === "ar"
          ? "سمك بني نهري طازج متبل ومقلي للدرجة الذهبية، يقدم فوق طبقة من أرز البسمتي المعطر بالهيل والزعفران ومزين بحشو الكشمش واللوز المحمص."
          : "Fresh river Bunni fish seasoned and fried to a golden crisp, served over premium basmati rice infused with cardamom and saffron, topped with raisins and toasted almonds.",
    },
    {
      id: "8",
      name:
        lang === "ar"
          ? "طاجن أخطبوط ومحار السي فود"
          : "Seafood Octopus & Clam Tajine (River Style)",
      category: "sea",
      price: lang === "ar" ? "28,000 د.ع" : "28,000 IQD",
      ingredients:
        lang === "ar"
          ? "قطع أخطبوط طرية مع محار البحر مطبوخة داخل طاجن فخاري مع فلفل الألوان، كريمة الطبخ اللذيذة وجبن الموزاريلا الذايب."
          : "Tender octopus pieces and fresh sea clams cooked in a clay pot with bell peppers, rich cooking cream, and melted mozzarella cheese.",
    },
    {
      id: "9",
      name:
        lang === "ar"
          ? "سمك مسقوف بغدادي أصيل"
          : "Authentic Baghdadi Masgouf Fish",
      category: "river",
      price: lang === "ar" ? "28,000 د.ع" : "28,000 IQD",
      ingredients:
        lang === "ar"
          ? "سمك كطان (أو بني) نهري طازج يشق من الظهر ويملح ويشوى ببطء على وتد خشب الحطب لمنحه نكهة التدخين الأصلية الشهيرة."
          : "Fresh river Kattan (or Bunni) fish, split from the back, salted, and slow-grilled on wooden pegs around open fire for that authentic smoky flavor.",
    },
    {
      id: "10",
      name:
        lang === "ar"
          ? "زوري شط العرب المقلي المقرمش"
          : "Crispy Fried Shatt Al-Arab Zawzi",
      category: "river",
      price: lang === "ar" ? "12,000 د.ع" : "12,000 IQD",
      ingredients:
        lang === "ar"
          ? "سمك زوزي صغير طازج من شط العرب متبل بالثوم والكمون والكاري ومقلي بالزيت الحار حتى يقرمش تماماً، يقدم مع الخبز الحار والجرجير."
          : "Fresh small Zawzi fish from Shatt Al-Arab marinated in garlic, cumin, and curry, deep-fried to total crispiness, served with hot bread and arugula.",
    },
    {
      id: "11",
      name:
        lang === "ar"
          ? "مرقة مسموطة بصرية تراثية"
          : "Traditional Basra Masmoota Stew",
      category: "river",
      price: lang === "ar" ? "15,000 د.ع" : "15,000 IQD",
      ingredients:
        lang === "ar"
          ? "المرقة البصرية التاريخية الشهيرة تُطبخ بالسمك المجفف تحت أشعة الشمس والمملح بعناية مع البصل والثوم والبهارات التراثية الثقيلة."
          : "The famous historic Basra stew cooked with traditional sun-dried salted fish, simmered with onions, garlic, and heavy heritage spices.",
    },
  ];

  return (
    <section id="menu" className="py-16 px-6 bg-[#001B2E]">
      <div className="container mx-auto max-w-5xl">
        {/* عناوين القسم */}
        <div className="text-center mb-12">
          <h2 className="text-[#D4AF37] text-lg font-semibold tracking-wider mb-2">
            ~ {lang === "ar" ? "قائمة الطعام" : "Food Menu"} ~
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-white">
            {lang === "ar"
              ? "تذوق روائع مطبخنا"
              : "Taste the Wonders of Our Kitchen"}
          </h3>
        </div>

        {/* أزرار التقسيم (Tabs) من shadcn بين البحري والنهري */}
        <Tabs defaultValue="all" dir="rtl" className="w-full text-center">
          <TabsList className="bg-[#073B4C] text-white p-1 rounded-full mb-10 inline-flex">
            <TabsTrigger
              value="all"
              className="rounded-full px-6 data-[state=active]:bg-[#118AB2] data-[state=active]:text-white"
            >
              {lang === "ar" ? "الكل" : "All"}
            </TabsTrigger>
            <TabsTrigger
              value="sea"
              className="rounded-full px-6 data-[state=active]:bg-[#118AB2] data-[state=active]:text-white"
            >
              {lang === "ar" ? "مأكولات بحرية" : "Seafood"}🌊
            </TabsTrigger>
            <TabsTrigger
              value="river"
              className="rounded-full px-6 data-[state=active]:bg-[#118AB2] data-[state=active]:text-white"
            >
              {lang === "ar" ? "أسماك نهرية" : "River Fish"}🐟
            </TabsTrigger>
          </TabsList>

          {/* محتوى القائمة */}
          {/* محتوى القائمة الذكي المفلتر */}
          {/* محتوى القائمة المطور بتأثير الزجاج والحركات الانسيابية */}
          <TabsContent
            value="all"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right mt-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-500"
          >
            {menuItems.map((item) => (
              <Card
                key={item.id}
                className="bg-[#073B4C]/20 backdrop-blur-md border border-[#118AB2]/30 text-white rounded-2xl overflow-hidden flex flex-col justify-between p-3 hover:border-[#D4AF37]/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300"
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold text-[#D4AF37]">
                      {item.name}
                    </CardTitle>
                    <span className="text-[#118AB2] font-bold text-lg bg-[#118AB2]/10 px-3 py-1 rounded-md whitespace-nowrap">
                      {item.price}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 text-sm pb-4">
                  {/* 🍽️ جعلنا الديف يغير اتجاه النص بالكامل حسب اللغة */}
                  <div className={lang === "ar" ? "text-right" : "text-left"}>
                    <h4
                      className={`font-bold text-[#D4AF37] mb-1 ${lang === "ar" ? "text-right text-sm" : "text-left text-base"}`}
                    >
                      {lang === "ar" ? "المكونات:" : ":Ingredients"}
                    </h4>
                    <p className="text-gray-400 leading-relaxed">
                      {item.ingredients}
                    </p>
                  </div>
                </CardContent>

                {/* 🛒 الزر يزحف لليسار بالإنكليزي واليمين بالعربي */}
                <CardFooter
                  className={`pt-2 flex ${lang === "ar" ? "justify-end" : "justify-start"}`}
                >
                  <Button className="bg-[#D4AF37] hover:bg-[#b8962e] text-[#001B2E] font-bold rounded-xl px-6">
                    {lang === "ar" ? "اطلب الآن" : "Order Now"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>

          <TabsContent
            value="sea"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right mt-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-500"
          >
            {menuItems
              .filter((item) => item.category === "sea")
              .map((item) => (
                <Card
                  key={item.id}
                  className="bg-[#073B4C]/20 backdrop-blur-md border border-[#118AB2]/30 text-white rounded-2xl overflow-hidden flex flex-col justify-between p-3 hover:border-[#D4AF37]/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold text-[#D4AF37]">
                        {item.name}
                      </CardTitle>
                      <span className="text-[#118AB2] font-bold text-lg bg-[#118AB2]/10 px-3 py-1 rounded-md whitespace-nowrap">
                        {item.price}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm pb-4">
                    {/* 🍽️ جعلنا الديف يغير اتجاه النص بالكامل حسب اللغة */}
                    <div className={lang === "ar" ? "text-right" : "text-left"}>
                      <h4
                        className={`font-bold text-[#D4AF37] mb-1 ${lang === "ar" ? "text-right text-sm" : "text-left text-base"}`}
                      >
                        {lang === "ar" ? "المكونات:" : ":Ingredients"}
                      </h4>
                      <p className="text-gray-400 leading-relaxed">
                        {item.ingredients}
                      </p>
                    </div>
                  </CardContent>

                  {/* 🛒 الزر يزحف لليسار بالإنكليزي واليمين بالعربي */}
                  <CardFooter
                    className={`pt-2 flex ${lang === "ar" ? "justify-end" : "justify-start"}`}
                  >
                    <Button className="bg-[#D4AF37] hover:bg-[#b8962e] text-[#001B2E] font-bold rounded-xl px-6">
                      {lang === "ar" ? "اطلب الآن" : "Order Now"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </TabsContent>

          <TabsContent
            value="river"
            className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right mt-6 animate-in fade-in-50 slide-in-from-bottom-5 duration-500"
          >
            {menuItems
              .filter((item) => item.category === "river")
              .map((item) => (
                <Card
                  key={item.id}
                  className="bg-[#073B4C]/20 backdrop-blur-md border border-[#118AB2]/30 text-white rounded-2xl overflow-hidden flex flex-col justify-between p-3 hover:border-[#D4AF37]/50 hover:shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold text-[#D4AF37]">
                        {item.name}
                      </CardTitle>
                      <span className="text-[#118AB2] font-bold text-lg bg-[#118AB2]/10 px-3 py-1 rounded-md whitespace-nowrap">
                        {item.price}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm pb-4">
                    {/* 🍽️ جعلنا الديف يغير اتجاه النص بالكامل حسب اللغة */}
                    <div className={lang === "ar" ? "text-right" : "text-left"}>
                      <h4
                        className={`font-bold text-[#D4AF37] mb-1 ${lang === "ar" ? "text-right text-sm" : "text-left text-base"}`}
                      >
                        {lang === "ar" ? "المكونات:" : ":Ingredients"}
                      </h4>
                      <p className="text-gray-400 leading-relaxed">
                        {item.ingredients}
                      </p>
                    </div>
                  </CardContent>

                  {/* 🛒 الزر يزحف لليسار بالإنكليزي واليمين بالعربي */}
                  <CardFooter
                    className={`pt-2 flex ${lang === "ar" ? "justify-end" : "justify-start"}`}
                  >
                    <Button className="bg-[#D4AF37] hover:bg-[#b8962e] text-[#001B2E] font-bold rounded-xl px-6">
                      {lang === "ar" ? "اطلب الآن" : "Order Now"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
