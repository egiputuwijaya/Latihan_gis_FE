"use client";

import { useSearchParams } from "next/navigation";
import ResetPasswordForm from "@/app/components/ResetPasswordForm";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return <p className="text-center mt-10">Token tidak valid</p>;
  }

  return <ResetPasswordForm token={token} />;
}
