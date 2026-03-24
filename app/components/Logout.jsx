"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const res = await fetch("http://localhost:3001/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Logout gagal");

      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white p-2 rounded"
    >
      Logout
    </button>
  );
}
