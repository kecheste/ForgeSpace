import { AppSidebar } from '@/components/app-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { SupabaseProvider } from '@/components/providers/supabase-provider';
import { WorkspaceProvider } from '@/components/providers/workspace-provider';
import { UserProfileProvider } from '@/components/providers/user-profile-provider';
import { SidebarProvider as CustomSidebarProvider } from '@/components/providers/sidebar-provider';
import { ErrorBoundary } from '@/components/error-boundary';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <SupabaseProvider>
        <WorkspaceProvider>
          <UserProfileProvider>
            <CustomSidebarProvider>
              <div className="flex h-screen w-full">
                <AppSidebar />
                <main className="flex-1 min-w-0">{children}</main>
              </div>
            </CustomSidebarProvider>
          </UserProfileProvider>
          <Toaster />
        </WorkspaceProvider>
      </SupabaseProvider>
    </ErrorBoundary>
  );
}
