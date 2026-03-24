"use client";

import ResetPasswordForm from "@/app/components/ResetPasswordForm";

export default function ResetPasswordFromDashboard() {
  // ⚠️ contoh: token diambil dari backend atau context
  const token = "token_dari_backend";

  return <ResetPasswordForm token={token} />;
}
