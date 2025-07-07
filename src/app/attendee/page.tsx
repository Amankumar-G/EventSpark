import { checkRole } from "@/utils/roles";
import { redirect } from "next/navigation";

export default async function AttendeePage() {
  if (!(await checkRole("Attendee") ||
        await checkRole("Organizer") || await checkRole("Admin")))
    redirect("/sign-in");
  return <h1>Attendee Home</h1>;
}
