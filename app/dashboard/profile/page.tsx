"use client";

import { useState, useEffect } from "react";

type Generate2FAResponse = {
  message: string;
  qrCode: string;
  recoveryCodes: string[];
};

type BasicResponse = { message: string };

export default function ProfilePage() {
  const [is2FAEnabled, setIs2FAEnabled] = useState<boolean>(false);

  const [qrCode, setQrCode] = useState<string>("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [otp, setOtp] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);

  // =========================
  // FETCH USER (PENTING 🔥)
  // =========================
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("http://localhost:3001/auth/me", {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        console.log("USER DATA", data);
        if (res.ok) {
          setIs2FAEnabled(data.user.isTwoFactorEnabled);
        } else {
          console.error("Gagal ambil user:", data);
        }
      } catch (err) {
        console.error("Error fetch user:", err);
      } finally {
        setLoadingUser(false);
      }
    }

    fetchUser();
  }, []);

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
  // GENERATE 2FA
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

      if (!res.ok) throw new Error(data.message || "Gagal generate QR");

      setQrCode(data.qrCode);
      setRecoveryCodes(data.recoveryCodes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // VERIFY OTP (AKTIFKAN 2FA)
  // =========================
  async function handleVerifyOTP() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch("http://localhost:3001/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
        credentials: "include",
      });

      const data: BasicResponse = await res.json();

      if (!res.ok) throw new Error(data.message || "OTP salah");

      setMessage(data.message);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, otp }),
        credentials: "include",
      });

      const data: BasicResponse = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal disable 2FA");

      setMessage(data.message);
      setIs2FAEnabled(false);
      setOtp("");
      setPassword("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // UI LOADING USER
  // =========================
  if (loadingUser) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Profile & Security</h1>

      {/* STATUS 2FA */}
      <div className="flex items-center justify-between">
        <span className="font-medium">Two-Factor Authentication (2FA)</span>
        <button
          onClick={is2FAEnabled ? handleDisable2FA : handleEnable2FA}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            is2FAEnabled ? "bg-red-500" : "bg-green-600"
          }`}
        >
          {is2FAEnabled ? "Disable" : "Enable"}
        </button>
      </div>

      {/* ERROR */}
      {error && <p className="text-red-500">{error}</p>}

      {/* MESSAGE */}
      {message && <p className="text-green-600">{message}</p>}

      {/* QR CODE + RECOVERY */}
      {qrCode && (
        <div className="space-y-4">
          <img src={qrCode} alt="QR Code" className="w-48 h-48" />

          <div>
            <h3 className="font-semibold">Recovery Codes:</h3>
            <ul className="text-sm">
              {recoveryCodes.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => downloadRecoveryCodes(recoveryCodes)}
            className="px-3 py-1 bg-gray-200 rounded"
          >
            Download Recovery Codes
          </button>

          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Masukkan OTP"
            className="border p-2 w-full"
          />

          <button
            onClick={handleVerifyOTP}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Verifikasi OTP
          </button>
        </div>
      )}

      {/* FORM DISABLE 2FA */}
      {is2FAEnabled && !qrCode && (
        <div className="space-y-3">
          <h3 className="font-semibold">Disable 2FA</h3>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full"
          />

          <input
            placeholder="OTP / Recovery Code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 w-full"
          />

          <button
            onClick={handleDisable2FA}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Disable 2FA
          </button>
        </div>
      )}
    </div>
  );
}
