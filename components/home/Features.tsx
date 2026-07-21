const features = [
  {
    title: "پاسخگویی سریع",
    desc: "در کمترین زمان ممکن",
    bg: "bg-blue-100",
    color: "text-blue-600",
    path: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "رانندگان حرفه‌ای",
    desc: "با بالاترین سطح ایمنی",
    bg: "bg-green-100",
    color: "text-green-600",
    path: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    title: "قیمت مناسب",
    desc: "مقرون به صرفه با تخفیف‌های ویژه",
    bg: "bg-purple-100",
    color: "text-purple-600",
    path: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "پشتیبانی ۲۴/۷",
    desc: "همیشه در دسترس شما هستیم",
    bg: "bg-red-100",
    color: "text-red-600",
    path: "M18.364 5.636L9.172 14.828a4 4 0 01-5.656 0L3 14.828m10.465 4.465L12 18.293l2.828-2.828a4 4 0 015.656 0L22 16.828",
  },
];

export default function Features() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">چرا سفیرو؟</h2>
        <p className="text-gray-600">سفرهای ایمن، سریع و مقرون به صرفه</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {features.map((f) => (
          <div key={f.title} className="text-center">
            <div
              className={`w-20 h-20 ${f.bg} rounded-full flex items-center justify-center mx-auto mb-4`}
            >
              <svg
                className={`w-10 h-10 ${f.color}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={f.path}
                />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
            <p className="text-gray-600 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
