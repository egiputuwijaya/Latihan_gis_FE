"use client";

import { useState } from "react";
import ProfileSidebar from "./components/ProfileSiderbar";
import UpdateProfileForm from "./components/UpdatedProfileForm";
import ChangePasswordForm from "./components/ChangePasswordForm";
import TwoFactorForm from "./components/TwoFactorForm";

type TabType = "profile" | "password" | "2fa";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-sm text-gray-600">
            Kelola informasi akun, password, dan keamanan akun kamu.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            {activeTab === "profile" && <UpdateProfileForm />}
            {activeTab === "password" && <ChangePasswordForm />}
            {activeTab === "2fa" && <TwoFactorForm />}
          </div>
        </div>
      </div>
    </div>
  );
}
