import LogoutButton from "../components/Logout";
export default function Dashboard() {
  return (
    <div className="">
      <h1>Hallo bang </h1>
      <a href="/dashboard/profile">halaman profile</a>
      <LogoutButton />
    </div>
  );
}
