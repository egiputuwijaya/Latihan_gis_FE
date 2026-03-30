import FeatureCard from "../card/Features";

export default function Features() {
  const features = [
    {
      title: "Analytics Dashboard",
      description: "Real-time insights into your business performance",
    },
    {
      title: "Merchant Management",
      description: "Easily manage all merchants from one dashboard",
    },
    {
      title: "Secure Payments",
      description: "Safe and fast payment processing",
    },
  ];

  return (
    <section id="features" className="py-24 px-10">
      <h3 className="text-4xl font-bold text-center mb-12">Features</h3>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((item, index) => (
          <FeatureCard key={index} {...item} />
        ))}
      </div>
    </section>
  );
}
