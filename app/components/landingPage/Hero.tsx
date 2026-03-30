"use client";

export default function Hero() {
  return (
    <section className="flex flex-col items-center text-center py-24 bg-gradient-to-b from-gray-100 to-white px-6">
      <h2 className="text-5xl font-bold max-w-3xl leading-tight mb-6">
        Manage Your Business Smarter with MerchantHub
      </h2>

      <p className="text-lg text-gray-600 max-w-xl mb-8">
        A powerful platform to monitor sales, manage merchants, and gain
        insights into your business performance in one place.
      </p>

      <div className="flex gap-4">
        <button className="bg-black text-white px-6 py-3 rounded-xl">
          Start Free Trial
        </button>
        <button className="border px-6 py-3 rounded-xl">Learn More</button>
      </div>
    </section>
  );
}
