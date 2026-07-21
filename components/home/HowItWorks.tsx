const steps = [
  { title: "مبدا و مقصد را وارد کنید", desc: "نقطه سوار و پیاده شدن را مشخص کنید" },
  { title: "نوع سرویس را انتخاب کنید", desc: "متناسب با نیاز خود سرویس مناسب را انتخاب کنید" },
  { title: "درخواست خود را ثبت کنید", desc: "با یک کلیک سفر خود را رزرو کنید" },
  { title: "سفر خود را آغاز کنید", desc: "از سفر خود لذت ببرید" },
];

export default function HowItWorks() {
  return (
    <div className="bg-linear-to-r from-gray-50 to-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            سفر خود را در ۴ قدم ساده رزرو کنید
          </h2>
          <p className="text-gray-600">سریع، آسان و هوشمند</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={s.title} className="text-center relative">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 relative z-10">
                {i + 1}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">{s.title}</h3>
              <p className="text-gray-600 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
