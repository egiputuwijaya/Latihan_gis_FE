"use client";

import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/constanst";
import { useAuth } from "@/hooks/useAuth";

type Generate2FAResponse = {
  qrCode: string;
  recoveryCodes: string[];
};

export default function TwoFactorForm() {
  const { user, refetchUser } = useAuth();

  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIs2FAEnabled(!!user?.isTwoFactorEnabled);
  }, [user]);

  function downloadRecoveryCodes(codes: string[]) {
    const blob = new Blob([codes.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "recovery-codes.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleEnable2FA() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/2fa/generate`, {
        method: "GET",
        credentials: "include",
      });

      const data: Generate2FAResponse = await res.json();

      if (!res.ok)
        throw new Error((data as any).message || "Gagal generate QR");

      setQrCode(data.qrCode);
      setRecoveryCodes(data.recoveryCodes);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/2fa/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "OTP salah");

      setMessage(data.message);
      setIs2FAEnabled(true);
      setQrCode("");
      setOtp("");
      await refetchUser();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  async function handleDisable2FA() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/2fa/disable`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password, otp }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal disable 2FA");

      setMessage(data.message);
      setIs2FAEnabled(false);
      setOtp("");
      setPassword("");
      await refetchUser();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Two Factor Authentication</h2>
          <p className="text-sm text-gray-500">
            Tambahkan lapisan keamanan tambahan untuk akun kamu.
          </p>
        </div>

        <button
          onClick={is2FAEnabled ? handleDisable2FA : handleEnable2FA}
          disabled={loading}
          className={`rounded-xl px-4 py-2 text-white ${
            is2FAEnabled ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {is2FAEnabled ? "Disable" : "Enable"}
        </button>
      </div>

      {message && <p className="text-green-600 text-sm">{message}</p>}
      {error && <p className="text-rose-500 text-sm">{error}</p>}

      {qrCode && (
        <div className="space-y-4">
          <img
            src={qrCode}
            alt="QR Code"
            className="w-48 h-48 rounded-xl border"
          />

          <div>
            <h3 className="font-semibold mb-2">Recovery Codes</h3>
            <ul className="text-sm space-y-1">
              {recoveryCodes.map((code, i) => (
                <li key={i} className="font-mono">
                  {code}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => downloadRecoveryCodes(recoveryCodes)}
            className="rounded-xl border px-4 py-2"
          >
            Download Recovery Codes
          </button>

          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Masukkan OTP"
            className="w-full rounded-xl border px-4 py-3"
          />

          <button
            onClick={handleVerifyOTP}
            className="rounded-xl bg-black text-white px-5 py-3"
          >
            Verifikasi OTP
          </button>
        </div>
      )}

      {is2FAEnabled && !qrCode && (
        <div className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
          />

          <input
            placeholder="OTP / Recovery Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
          />

          <button
            onClick={handleDisable2FA}
            className="rounded-xl bg-red-500 text-white px-5 py-3"
          >
            Disable 2FA
          </button>
        </div>
      )}
    </div>
  );
}
