"use client";

import { useEffect, useState } from "react";

type UserResponse = {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    isVerified: boolean;
    roles: string[];
    isTwoFactorEnabled: boolean;
    pendingEmail?: string | null;
  };
};

type ApiResponse = {
  message?: string;
  error?: string;
};

export default function UpdateProfileForm() {
  const [loadingUser, setLoadingUser] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [initialEmail, setInitialEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // FETCH USER PROFILE
  // =========================
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("http://localhost:3001/auth/me", {
          method: "GET",
          credentials: "include",
        });

        const data: UserResponse = await res.json();

        if (!res.ok) {
          throw new Error("Gagal mengambil data profile");
        }

        setName(data.user.name || "");
        setPhone(data.user.phone || "");
        setEmail(data.user.email || "");
        setInitialEmail(data.user.email || "");
        setIsVerified(data.user.isVerified);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoadingUser(false);
      }
    }

    fetchProfile();
  }, []);

  // =========================
  // SAVE PROFILE
  // =========================
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("http://localhost:3001/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          phone,
          email,
        }),
      });

      const data: ApiResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal memperbarui profile");
      }

      setMessage(
        email !== initialEmail
          ? data.message ||
              "Profile diperbarui. Silakan cek email baru kamu untuk verifikasi."
          : data.message || "Profile berhasil diperbarui",
      );

      setInitialEmail(email);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  if (loadingUser) {
    return <p className="text-sm text-gray-500">Memuat data profile...</p>;
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Profile Information
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Ubah nama, nomor handphone, dan email akun kamu.
        </p>
      </div>

      {!isVerified && (
        <div className="mb-4 rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          Email akun ini belum terverifikasi.
        </div>
      )}

      {message && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* NAME */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Nama
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
            required
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Nomor Handphone
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Contoh: 081234567890"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email"
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
            required
          />
          <p className="mt-2 text-xs text-gray-500">
            Jika email diubah, sistem akan mengirim link verifikasi ke email
            baru.
          </p>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
