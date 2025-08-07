'use client';

import { useWorkspace } from '@/components/providers/workspace-provider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageSkeleton } from '@/components/ui/loading-skeleton';
import { useToast } from '@/hooks/use-toast';
import { workspacesAPI } from '@/lib/api/workspaces';
import { useUser } from '@clerk/nextjs';
import {
  Building2,
  Lightbulb,
  MoreHorizontal,
  Plus,
  Settings,
  Trash2,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface WorkspaceWithDetails {
  id: string;
  name: string;
  description: string | null;
  type: 'personal' | 'team';
  ideas: number;
  members: number;
  lastActivity: string;
  members_avatars: Array<{ initials: string }>;
}

function WorkspaceCard({
  workspace,
  onDelete,
}: {
  workspace: WorkspaceWithDetails;
  onDelete: (workspace: WorkspaceWithDetails) => void;
}) {
  return (
    <Card className="hover:border-primary transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`h-10 w-10 rounded-md ${workspace.type === 'personal' ? 'bg-blue-500' : 'bg-green-500'} flex items-center justify-center`}
            >
              <Lightbulb className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate">
                {workspace.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground truncate">
                {workspace.description}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/workspaces/${workspace.id}/settings`}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/workspaces/${workspace.id}/members`}>
                  <Users className="mr-2 h-4 w-4" />
                  Members
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => onDelete(workspace)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Lightbulb className="h-3 w-3" />
              {workspace.ideas}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <Users className="h-3 w-3" />
              {workspace.members}
            </span>
          </div>
          <Badge
            variant={workspace.type === 'personal' ? 'outline' : 'default'}
          >
            {workspace.type}
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {workspace.members_avatars?.slice(0, 3).map((member, index) => (
              <Avatar key={index} className="h-6 w-6">
                <AvatarFallback className="text-xs">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
            ))}
            {workspace.members > 3 && (
              <div className="text-xs text-muted-foreground">
                +{workspace.members - 3}
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Updated {workspace.lastActivity}
          </div>
        </div>

        <Button size="sm" className="w-full mt-3" asChild>
          <Link href={`/dashboard/workspaces/${workspace.id}`}>
            Open Workspace
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function WorkspacesPage() {
  const { user } = useUser();
  const { currentWorkspace, setCurrentWorkspace } = useWorkspace();
  const [workspaces, setWorkspaces] = useState<WorkspaceWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [workspaceToDelete, setWorkspaceToDelete] =
    useState<WorkspaceWithDetails | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) loadWorkspaces();
  }, [user]);

  const loadWorkspaces = async () => {
    try {
      setLoading(true);
      const workspaceList = await workspacesAPI.getWorkspaces(user!.id);

      interface WorkspaceAPIType {
        id: string;
        name: string;
        description: string | null;
        type: 'personal' | 'team';
        ideas?: Array<unknown>;
        workspace_members?: Array<{
          user?: {
            first_name?: string;
            last_name?: string;
          };
        }>;
        updated_at?: string;
      }

      const workspacesWithDetails: WorkspaceWithDetails[] = workspaceList.map(
        (workspace: WorkspaceAPIType) => ({
          id: workspace.id,
          name: workspace.name,
          description: workspace.description,
          type: workspace.type,
          ideas: workspace.ideas?.length || 0,
          members: workspace.workspace_members?.length || 0,
          lastActivity: workspace.updated_at
            ? new Date(workspace.updated_at).toLocaleDateString()
            : 'Never',
          members_avatars:
            workspace.workspace_members?.slice(0, 3).map((member) => ({
              initials: `${member.user?.first_name?.charAt(0) || ''}${member.user?.last_name?.charAt(0) || ''}`,
            })) || [],
        })
      );

      setWorkspaces(workspacesWithDetails);
    } catch (error) {
      console.error('Error loading workspaces:', error);
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkspace = async () => {
    if (!workspaceToDelete) return;

    try {
      setDeleting(true);
      await workspacesAPI.deleteWorkspace(workspaceToDelete.id, user!.id);
      setWorkspaces((prev) =>
        prev.filter((w) => w.id !== workspaceToDelete.id)
      );

      if (currentWorkspace?.id === workspaceToDelete.id) {
        setCurrentWorkspace(null);
      }

      toast({
        title: 'Workspace deleted',
        description: `${workspaceToDelete.name} has been removed.`,
      });
    } catch (error) {
      console.error('Error deleting workspace:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete workspace',
        variant: 'destructive',
      });
    } finally {
      setDeleting(false);
      setWorkspaceToDelete(null);
    }
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur">
        <div className="flex-1">
          <h1 className="text-lg font-medium">Workspaces</h1>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/workspaces/new">
            <Plus className="mr-2 h-4 w-4" />
            New Workspace
          </Link>
        </Button>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="w-full space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    Workspaces
                  </CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workspaces.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Ideas</CardTitle>
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workspaces.reduce((sum, w) => sum + w.ideas, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">Members</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {workspaces.reduce((sum, w) => sum + w.members, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workspaces Grid */}
          {workspaces.length === 0 ? (
            <Card className="border-0 shadow-none text-center py-12">
              <CardContent>
                <div className="space-y-4">
                  <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">No workspaces</h3>
                    <p className="text-sm text-muted-foreground">
                      Create a workspace to organize your ideas
                    </p>
                  </div>
                  <Button asChild>
                    <Link href="/dashboard/workspaces/new">
                      <Plus className="mr-2 h-4 w-4" />
                      New Workspace
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workspaces.map((workspace) => (
                <WorkspaceCard
                  key={workspace.id}
                  workspace={workspace}
                  onDelete={setWorkspaceToDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!workspaceToDelete}
        onOpenChange={() => !deleting && setWorkspaceToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete workspace?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{workspaceToDelete?.name}" and all
              its content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWorkspace}
              disabled={deleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
