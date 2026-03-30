"use client";

import { useState } from "react";
import { API_BASE_URL } from "@/lib/constanst";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password tidak sama");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal mengganti password");

      setMessage(data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Change Password</h2>
      <p className="text-sm text-gray-500 mb-6">
        Ganti password akun kamu dengan aman.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          className="w-full rounded-xl border px-4 py-3"
          placeholder="Password Lama"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <input
          type="password"
          className="w-full rounded-xl border px-4 py-3"
          placeholder="Password Baru"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          className="w-full rounded-xl border px-4 py-3"
          placeholder="Konfirmasi Password Baru"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {message && <p className="text-green-600 text-sm">{message}</p>}
        {error && <p className="text-rose-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-black text-white px-5 py-3"
        >
          {loading ? "Memproses..." : "Update Password"}
        </button>
      </form>
    </div>
  );
}
