"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Login2FAPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [tempToken, setTempToken] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("tempToken");
    if (!token) {
      setError("TempToken tidak ditemukan, login ulang dulu");
    } else {
      setTempToken(token);
    }
  }, [searchParams]);

  async function handleLogin2FA() {
    if (!tempToken) return;

    setError("");
    try {
      const res = await fetch("http://localhost:3001/auth/login-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken, otp }),
        credentials: "include", // penting untuk cookie
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP salah");

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Masukkan OTP 2FA</h1>

      <input
        type="text"
        placeholder="Masukkan OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full border p-2 rounded mb-4"
      />

      <button
        onClick={handleLogin2FA}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Login 2FA
      </button>

      {error && <p className="text-rose-500 mt-2">{error}</p>}
    </div>
  );
}
