"use client";

import { useState } from "react";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");
    setError("");

    // ================= VALIDASI FRONTEND =================
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Semua field wajib diisi");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password baru minimal 6 karakter");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password baru dan konfirmasi password tidak sama");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3001/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 wajib agar cookie access_token ikut terkirim
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Gagal mengganti password");
        return;
      }

      setMessage(data.message || "Password berhasil diubah");

      // reset form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Change password error:", err);
      setError("Terjadi kesalahan pada server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f5f5f5",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#fff",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "8px" }}
        >
          Ganti Password
        </h1>

        <p style={{ color: "#666", marginBottom: "20px" }}>
          Masukkan password lama dan password baru kamu.
        </p>

        <form onSubmit={handleChangePassword}>
          {/* PASSWORD LAMA */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}
            >
              Password Lama
            </label>
            <input
              type="password"
              placeholder="Masukkan password lama"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
              }}
            />
          </div>

          {/* PASSWORD BARU */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}
            >
              Password Baru
            </label>
            <input
              type="password"
              placeholder="Masukkan password baru"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
              }}
            />
          </div>

          {/* KONFIRMASI PASSWORD */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{ display: "block", marginBottom: "6px", fontWeight: 500 }}
            >
              Konfirmasi Password Baru
            </label>
            <input
              type="password"
              placeholder="Ulangi password baru"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                outline: "none",
              }}
            />
          </div>

          {/* ERROR */}
          {error && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                borderRadius: "8px",
                background: "#ffe5e5",
                color: "#c62828",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {message && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                borderRadius: "8px",
                background: "#e8f5e9",
                color: "#2e7d32",
                fontSize: "14px",
              }}
            >
              {message}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              background: loading ? "#999" : "#111",
              color: "#fff",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Menyimpan..." : "Simpan Password Baru"}
          </button>
        </form>
      </div>
    </div>
  );
}
