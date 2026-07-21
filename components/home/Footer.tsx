import Image from "next/image";
import Link from "next/link";

const trustBadges = [
  {
    title: "تضمین اصالت کالا",
    path: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z",
  },
  {
    title: "پشتیبانی تلفنی",
    path: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    title: "مهلت ۷ روز بازگشت کالا",
    path: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  },
  {
    title: "ارسال سریع کالا",
    path: "M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1",
  },
];

const quickLinks = ["بلاگ", "تماس با ما"];

const socialLinks = [
  {
    name: "تلگرام",
    href: "#",
    color: "text-sky-500",
    path: "M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z",
  },
  {
    name: "اینستاگرام",
    href: "#",
    color: "text-pink-500",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.9 5.9 0 00.63 4.14c-.3.76-.5 1.64-.56 2.9C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13.67.66 1.34 1.08 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 002.13-1.38 5.9 5.9 0 001.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 00-1.38-2.13A5.9 5.9 0 0019.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 100 12.32 6.16 6.16 0 000-12.32zM12 16a4 4 0 110-8 4 4 0 010 8zm6.4-10.85a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z",
  },
  {
    name: "واتساپ",
    href: "#",
    color: "text-green-500",
    path: "M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 01-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 01-1.44-5.01c0-5.18 4.22-9.4 9.41-9.4 2.51 0 4.87.98 6.64 2.75a9.35 9.35 0 012.75 6.66c0 5.18-4.22 9.4-9.4 9.4zm8-17.4A11.32 11.32 0 0012.05 1C5.83 1 .77 6.06.77 12.28c0 1.99.52 3.93 1.51 5.64L.68 23.65l5.86-1.54a11.3 11.3 0 005.51 1.4h.01c6.22 0 11.28-5.06 11.28-11.28 0-3.02-1.17-5.85-3.3-7.98z",
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      {/* نوار مزیت‌ها */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((b) => (
              <div
                key={b.title}
                className="flex flex-col items-center text-center gap-2"
              >
                <svg
                  className="w-10 h-10 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d={b.path}
                  />
                </svg>
                <span className="font-semibold text-gray-800 text-sm">
                  {b.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* اطلاعات پشتیبانی */}
      <div className="container mx-auto px-4 py-6 border-b border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-center">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>شنبه تا چهارشنبه ۸ الی ۲۱ - پنجشنبه ۸ الی ۲۰:۳۰</span>
            <span className="hidden md:inline text-gray-300">|</span>
            <span>تلفن : ۰۴۱۳۳۸۱۰۵۱۹</span>
          </div>
          <h3 className="text-lg font-bold text-purple-600 md:mr-6">
            پشتیبانی
          </h3>
        </div>
      </div>

      {/* ستون‌های اصلی */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* لینک‌های سریع */}
          <div className="text-right">
            <h3 className="font-bold text-gray-800 mb-4">سفیرو</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-gray-600 hover:text-purple-600 text-sm transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* شبکه‌های اجتماعی */}
          <div className="text-right">
            <h3 className="font-bold text-gray-800 mb-2">تماس با ما</h3>
            <p className="text-gray-500 text-sm mb-4">
              مارا در صفحات مجازی دنبال کنید
            </p>
            <ul className="space-y-3 flex justify-between">
              {socialLinks.map((s) => (
                <li key={s.name}>
                  <Link
                    href={s.href}
                    className="flex items-center justify-end gap-2 text-gray-600 hover:text-purple-600 text-sm transition-colors"
                  >
                    <span>{s.name}</span>
                    <svg
                      className={`w-6 h-6 ${s.color}`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={s.path} />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* نماد اعتماد */}
          <div className="flex justify-center md:justify-start">
            <a href="#" className="block w-32">
              <Image
                src="/enmad.webp"
                alt="نماد اعتماد الکترونیکی"
                width={128}
                height={160}
                className="rounded-lg"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
