import { FeatureItem } from "@/types";

export default function FeatureCard({ title, description, icon }: FeatureItem) {
  return (
    <div className="p-6 rounded-2xl shadow hover:shadow-lg transition">
      <div className="mb-4 text-3xl">{icon}</div>
      <h4 className="text-xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
