import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  if (!(await checkRole("Admin"))) redirect("/sign-in");
  return <h1>Admin Dashboard</h1>;
}
