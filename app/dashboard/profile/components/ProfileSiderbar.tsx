"use client";

type TabType = "profile" | "password" | "2fa";

interface ProfileSidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
}: ProfileSidebarProps) {
  const menu = [
    {
      key: "profile" as TabType,
      title: "Profile Information",
      desc: "Nama, email, dan nomor telepon",
    },
    {
      key: "password" as TabType,
      title: "Update Password",
      desc: "Ganti password akun kamu",
    },
    {
      key: "2fa" as TabType,
      title: "Two-Factor Authentication",
      desc: "Keamanan login tambahan",
    },
  ];

  return (
    <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
      <div className="mb-3 px-3 pt-2">
        <h2 className="text-sm font-semibold text-gray-900">Settings</h2>
        <p className="mt-1 text-xs text-gray-500">
          Pilih pengaturan yang ingin kamu ubah.
        </p>
      </div>

      <div className="space-y-1">
        {menu.map((item) => {
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full rounded-xl px-3 py-3 text-left transition ${
                isActive
                  ? "bg-black text-white"
                  : "hover:bg-gray-100 text-gray-800"
              }`}
            >
              <div className="text-sm font-semibold">{item.title}</div>
              <div
                className={`mt-1 text-xs ${
                  isActive ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {item.desc}
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
