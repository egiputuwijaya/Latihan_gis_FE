"use client";

import { useEffect, useState } from "react";

type Generate2FAResponse = {
  message: string;
  qrCode: string;
  recoveryCodes: string[];
};

type MeResponse = {
  user: {
    isTwoFactorEnabled: boolean;
  };
};

type BasicResponse = {
  message: string;
};

export default function TwoFactorForm() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loading, setLoading] = useState(false);

  const [qrCode, setQrCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // FETCH USER
  // =========================
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:3001/auth/me", {
          method: "GET",
          credentials: "include",
        });

        const data: MeResponse = await res.json();

        if (!res.ok) {
          throw new Error("Gagal mengambil data user");
        }

        setIs2FAEnabled(data.user.isTwoFactorEnabled);
      } catch (err) {
        console.error("Error fetch user:", err);
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUser();
  }, []);

  // =========================
  // DOWNLOAD RECOVERY CODES
  // =========================
  function downloadRecoveryCodes(codes: string[]) {
    const blob = new Blob([codes.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  // =========================
  // ENABLE 2FA
  // =========================
  async function handleEnable2FA() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:3001/auth/2fa/generate", {
        method: "GET",
        credentials: "include",
      });

      const data: Generate2FAResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal generate QR");
      }

      setQrCode(data.qrCode);
      setRecoveryCodes(data.recoveryCodes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // VERIFY OTP
  // =========================
  async function handleVerifyOTP() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:3001/auth/2fa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ otp }),
      });

      const data: BasicResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "OTP salah");
      }

      setMessage(data.message || "2FA berhasil diaktifkan");
      setIs2FAEnabled(true);
      setQrCode("");
      setOtp("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // DISABLE 2FA
  // =========================
  async function handleDisable2FA() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:3001/auth/2fa/disable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password, otp }),
      });

      const data: BasicResponse = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal menonaktifkan 2FA");
      }

      setMessage(data.message || "2FA berhasil dinonaktifkan");
      setIs2FAEnabled(false);
      setOtp("");
      setPassword("");
      setQrCode("");
      setRecoveryCodes([]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  if (loadingUser) {
    return (
      <p className="text-sm text-gray-500">Memuat pengaturan keamanan...</p>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Two-Factor Authentication
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Tambahkan lapisan keamanan ekstra saat login.
        </p>
      </div>

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

      {/* STATUS */}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-200 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-base font-semibold text-gray-900">
            Status Two-Factor Authentication
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {is2FAEnabled
              ? "2FA saat ini aktif di akun kamu."
              : "2FA belum aktif di akun kamu."}
          </p>
        </div>

        {!is2FAEnabled && !qrCode && (
          <button
            onClick={handleEnable2FA}
            disabled={loading}
            className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Enable 2FA"}
          </button>
        )}
      </div>

      {/* QR CODE STEP */}
      {qrCode && (
        <div className="space-y-5 rounded-2xl border border-gray-200 p-5">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Scan QR Code
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Scan QR ini dengan Google Authenticator, Authy, atau aplikasi OTP
              lainnya.
            </p>
          </div>

          <img
            src={qrCode}
            alt="QR Code 2FA"
            className="h-52 w-52 rounded-xl border border-gray-200 object-contain p-2"
          />

          <div>
            <h4 className="mb-2 text-sm font-semibold text-gray-900">
              Recovery Codes
            </h4>
            <div className="grid gap-2 rounded-xl bg-gray-50 p-4 text-sm text-gray-800 md:grid-cols-2">
              {recoveryCodes.map((code, index) => (
                <div
                  key={index}
                  className="rounded-lg border bg-white px-3 py-2"
                >
                  {code}
                </div>
              ))}
            </div>

            <button
              onClick={() => downloadRecoveryCodes(recoveryCodes)}
              className="mt-3 rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Download Recovery Codes
            </button>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              OTP Code
            </label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Masukkan 6 digit OTP"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
            />
          </div>

          <button
            onClick={handleVerifyOTP}
            disabled={loading}
            className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Memverifikasi..." : "Verify & Activate"}
          </button>
        </div>
      )}

      {/* DISABLE STEP */}
      {is2FAEnabled && !qrCode && (
        <div className="space-y-5 rounded-2xl border border-gray-200 p-5">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Disable Two-Factor Authentication
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Untuk menonaktifkan 2FA, masukkan password dan OTP / recovery
              code.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              OTP / Recovery Code
            </label>
            <input
              placeholder="Masukkan OTP atau recovery code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
            />
          </div>

          <button
            onClick={handleDisable2FA}
            disabled={loading}
            className="rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Disable 2FA"}
          </button>
        </div>
      )}
    </div>
  );
}
