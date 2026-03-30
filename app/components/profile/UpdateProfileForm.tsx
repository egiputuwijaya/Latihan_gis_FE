"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/constanst";
import { useAuth } from "@/hooks/useAuth";

export default function UpdateProfileForm() {
  const { user, refetchUser } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setEmail(user.email || "");
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          phone,
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal update profile");

      setMessage(data.message);
      await refetchUser();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Update Profile</h2>
      <p className="text-sm text-gray-500 mb-6">
        Ubah nama, nomor handphone, dan email akun kamu.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Nama</label>
          <input
            className="mt-1 w-full rounded-xl border px-4 py-3"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nama lengkap"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Nomor Handphone</label>
          <input
            className="mt-1 w-full rounded-xl border px-4 py-3"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="08xxxxxxxxxx"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-xl border px-4 py-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@gmail.com"
          />
          <p className="mt-2 text-xs text-gray-500">
            Jika email diubah, sistem akan mengirim link verifikasi ke email
            baru.
          </p>
        </div>

        {message && <p className="text-green-600 text-sm">{message}</p>}
        {error && <p className="text-rose-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-black text-white px-5 py-3"
        >
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </form>
    </div>
  );
}
