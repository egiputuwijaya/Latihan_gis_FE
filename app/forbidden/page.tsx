import Link from "next/link";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-lg rounded-2xl border bg-white p-8 shadow-sm text-center">
        <h1 className="text-3xl font-bold mb-3">403 - Forbidden</h1>
        <p className="text-gray-600 mb-6">
          Kamu tidak memiliki akses ke halaman ini.
        </p>

        <Link
          href="/dashboard"
          className="inline-block rounded-xl bg-black text-white px-5 py-3"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}
