import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import DashboardClientV2 from "@/components/DashboardClientV2";

export const metadata = {
  title: "Dashboard - XPense Control",
  description: "Dashboard executivo de controle financeiro",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return <DashboardClientV2 />;
}
