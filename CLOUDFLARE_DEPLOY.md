# 🚀 دليل رفع ونشر الداشبورد على Cloudflare Pages

تم تصميم وبناء هذا التطبيق ليكون مجانياً 100% ورسيعاً جداً عند النشر على منصة **Cloudflare Pages**.

---

## 🛠️ الطريقة الأولى: النشر المباشر عبر أسطر الأوامر (Wrangler CLI)

1. **بناء نسخة الإنتاج المستقرة (Build)**:
   افتح مجلد المشروع في التيرمينال وشغّل الأمر التالي:
   ```bash
   npm run build
   ```
   سيتم إنشاء مجلد باسم `dist` يحتوي على ملفات التطبيق التفاعلي.

2. **الرفع المباشر إلى Cloudflare**:
   شغّل الأمر التالي:
   ```bash
   npx wrangler pages deploy dist --project-name=healthcare-kpi-dashboard
   ```
   *ملاحظة: إذا كانت هذه المرة الأولى، سيطلب منك Cloudflare تسجيل الدخول في المتصفح للحصول على رابط النشر المباشر `https://healthcare-kpi-dashboard.pages.dev`.*

---

## 🐙 الطريقة الثانية: الربط التلقائي عبر GitHub (الأسهل والأنسب للفرق)

1. **رفع الكود على GitHub**:
   - قم بإنشاء مستودع جديد (Repository) على حسابك في GitHub وقم برفع الكود إليه.

2. **التوصيل بـ Cloudflare Pages**:
   - ادخل إلى حسابك في [Cloudflare Dashboard](https://dash.cloudflare.com/).
   - من القائمة الجانبية اختر **Workers & Pages**.
   - اضغط على **Create Application** ثم اختر تبويب **Pages**.
   - انقر على **Connect to Git** واختر مستودع المشروع.

3. **إعدادات البناء (Build Settings)**:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - اضغط **Save and Deploy**.

سيقوم Cloudflare بنشر الداشبورد تلقائياً وتزويدك برابط مباشر آمن مزود بشهادة SSL مجانية وتحديثه تلقائياً عند أي تعديل!
