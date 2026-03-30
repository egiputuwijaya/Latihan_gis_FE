import { cookies } from "next/headers";

export async function hasAccessToken() {
  const cookieStore = await cookies();
  return !!cookieStore.get("access_token");
}
