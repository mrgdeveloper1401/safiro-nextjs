const testimonials = [
  { text: "سفیر بهترین تجربه سفر من بود. راننده بسیار حرفه‌ای و خودرو تمیز.", name: "محمد رضایی" },
  { text: "قیمت‌ها بسیار مناسب و پشتیبانی عالی. حتما سفارش میدم.", name: "سارا احمدی" },
  { text: "سریع و به موقع رسیدن، واقعا عالی بود. حتما استفاده می‌کنم.", name: "علی کریمی" },
];

export default function Testimonials() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">نظرات کاربران</h2>
        <p className="text-gray-600">آنچه مسافران ما می‌گویند</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div key={t.name} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="text-yellow-400 flex">★★★★★</div>
            </div>
            <p className="text-gray-600 mb-4">&quot;{t.text}&quot;</p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="mr-3">
                <div className="font-semibold text-gray-800">{t.name}</div>
                <div className="text-sm text-gray-500">مسافر</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
