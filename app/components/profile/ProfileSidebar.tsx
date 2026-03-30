"use client";

type Tab = "profile" | "password" | "2fa";

type Props = {
  activeTab: Tab;
  onChange: (tab: Tab) => void;
};

export default function ProfileSidebar({ activeTab, onChange }: Props) {
  const items: { key: Tab; label: string }[] = [
    { key: "profile", label: "Update Profile" },
    { key: "password", label: "Change Password" },
    { key: "2fa", label: "Two Factor Auth" },
  ];

  return (
    <aside className="w-full md:w-72 rounded-2xl border bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>

      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`w-full text-left px-4 py-3 rounded-xl transition ${
              activeTab === item.key
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
