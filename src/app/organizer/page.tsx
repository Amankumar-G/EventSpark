import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";

export default async function OrganizerPage() {
  const ok = await checkRole("Organizer") || (await checkRole("Admin"));
  if (!ok) redirect("/sign-in");
  return <h1>Organizer Dashboard</h1>;
}
