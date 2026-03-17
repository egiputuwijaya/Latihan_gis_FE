"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmail() {
  const params = useSearchParams();
  const router = useRouter();

  const token = params.get("token");

  const [message, setMessage] = useState("Memverifikasi...");
  const [countdown, setCountdown] = useState(5);
  const [verified, setVerified] = useState(false);

  // 🔹 Verifikasi token
  useEffect(() => {
    if (!token) return;

    fetch(`http://localhost:3001/auth/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message || "Berhasil diverifikasi");
        setVerified(true);
      })
      .catch(() => setMessage("Verifikasi gagal"));
  }, [token]);

  // 🔹 Countdown & redirect
  useEffect(() => {
    if (!verified) return;

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      router.push("/login"); // arahkan ke halaman login
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [verified, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-xl font-bold">{message}</h1>

        {verified && (
          <p className="text-gray-600">
            Redirect ke halaman login dalam {countdown} detik...
          </p>
        )}
      </div>
    </div>
  );
}
