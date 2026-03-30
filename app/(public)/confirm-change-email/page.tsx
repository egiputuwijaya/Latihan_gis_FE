"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ConfirmChangeEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("Memverifikasi email baru...");

  useEffect(() => {
    async function confirmEmailChange() {
      if (!token) {
        setSuccess(false);
        setMessage("Token tidak ditemukan.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:3001/auth/confirm-change-email?token=${token}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Gagal verifikasi perubahan email");
        }

        setSuccess(true);
        setMessage(data.message || "Email berhasil diperbarui");

        // redirect ke profile setelah sukses
        setTimeout(() => {
          router.push("/dashboard/profile");
        }, 2500);
      } catch (err: any) {
        setSuccess(false);
        setMessage(err.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    }

    confirmEmailChange();
  }, [token, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-sm p-8 text-center">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-slate-900">
            Konfirmasi Perubahan Email
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sistem sedang memproses perubahan email akun Anda.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
            <p className="text-slate-600">{message}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
                success
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {success ? "✓" : "✕"}
            </div>

            <p
              className={`text-base font-medium ${
                success ? "text-green-600" : "text-red-500"
              }`}
            >
              {message}
            </p>

            {success ? (
              <p className="text-sm text-slate-500">
                Anda akan diarahkan ke halaman profile...
              </p>
            ) : (
              <button
                onClick={() => router.push("/dashboard/profile")}
                className="mt-2 rounded-xl bg-slate-900 px-4 py-2 text-white hover:bg-slate-800 transition"
              >
                Kembali ke Profile
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
