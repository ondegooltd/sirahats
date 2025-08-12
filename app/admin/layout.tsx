import AdminLayout from "@/components/admin/admin-layout";
import { AppSessionProvider } from "@/components/session-provider";
import { Toaster } from "@/components/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppSessionProvider>
      {children}
      <Toaster />
    </AppSessionProvider>
  );
}
