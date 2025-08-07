'use client';

import { RealtimeIndicator } from '@/components/realtime-indicator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WorkspaceSkeleton } from '@/components/ui/loading-skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ideasAPI } from '@/lib/api/ideas';
import { usersAPI } from '@/lib/api/users';
import { workspacesAPI } from '@/lib/api/workspaces';
import { useUser } from '@clerk/nextjs';
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Crown,
  Edit,
  Eye,
  Lightbulb,
  Mail,
  MoreHorizontal,
  Plus,
  Shield,
  Trash2,
  TrendingUp,
  UserPlus,
  Users,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const roleColors = {
  owner: 'bg-yellow-100 text-yellow-800',
  admin: 'bg-purple-100 text-purple-800',
  member: 'bg-blue-100 text-blue-800',
  viewer: 'bg-gray-100 text-gray-800',
};

const roleIcons = {
  owner: Crown,
  admin: Shield,
  member: Users,
  viewer: Eye,
};

type Idea = {
  id: string;
  title: string;
  description: string;
  phase: string;
  tags: string[];
  creator?: {
    id: string;
    first_name: string;
    last_name: string;
    image_url?: string;
  };
  updated_at: string;
};

type Invitation = {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'viewer';
  expires_at: string;
  isExistingUser: boolean;
};

function IdeaCard({ idea }: { idea: Idea }) {
  const phaseColors = {
    inception: 'bg-blue-100 text-blue-800',
    refinement: 'bg-yellow-100 text-yellow-800',
    planning: 'bg-orange-100 text-orange-800',
    execution_ready: 'bg-green-100 text-green-800',
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              <Link href={`/ideas/${idea.id}`} className="hover:underline">
                {idea.title}
              </Link>
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {idea.description}
            </CardDescription>
          </div>
          <Badge
            className={phaseColors[idea.phase as keyof typeof phaseColors]}
          >
            {idea.phase.replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage
                src={idea.creator?.image_url || '/placeholder.svg'}
              />
              <AvatarFallback className="text-xs">
                {idea.creator?.first_name?.[0]}
                {idea.creator?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <span>
              {idea.creator?.first_name} {idea.creator?.last_name}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(idea.updated_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type Member = {
  role: 'owner' | 'admin' | 'member' | 'viewer';
  user?: {
    id: string;
    clerk_user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    image_url?: string;
  };
};

type Workspace = {
  name: string;
  description: string;
  type: 'personal' | 'team';
  id?: string | undefined;
  workspace_members?: Member[];
  created_at?: string | undefined;
  updated_at?: string | undefined;
  owner?: {
    id: string;
    clerk_user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    image_url?: string;
  };
};

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const workspaceId = params.id as string;

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member' | 'viewer'>(
    'member'
  );
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [inviting, setInviting] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    description: '',
    type: 'personal' as 'personal' | 'team',
  });

  useEffect(() => {
    if (user && workspaceId) {
      loadWorkspaceData();
    }
  }, [user, workspaceId]);

  const loadWorkspaceData = async () => {
    try {
      const profile = await usersAPI.createOrUpdateProfile({
        clerk_user_id: user!.id,
        email: user!.emailAddresses[0]?.emailAddress || '',
        first_name: user!.firstName,
        last_name: user!.lastName,
        image_url: user!.imageUrl,
      });
      setUserProfile(profile);

      const workspaceData = await workspacesAPI.getWorkspace(
        workspaceId,
        user!.id
      );
      setWorkspace(workspaceData);
      setMembers(workspaceData.workspace_members || []);
      setEditData({
        name: workspaceData.name,
        description: workspaceData.description || '',
        type: workspaceData.type,
      });

      const ideasData = await ideasAPI.getIdeas(workspaceId, profile.id);
      setIdeas(ideasData || []);

      try {
        const invitationsData = await workspacesAPI.getPendingInvitations(
          workspaceId,
          user!.id
        );
        setInvitations(invitationsData || []);
      } catch (error) {
        console.error('Error loading invitations:', error);
        setInvitations([]);
      }
    } catch (error) {
      console.error('Error loading workspace:', error);
      toast({
        title: 'Error',
        description: 'Failed to load workspace data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWorkspace = async () => {
    try {
      await workspacesAPI.updateWorkspace(workspaceId, editData, user!.id);
      setWorkspace({ ...workspace, ...editData });
      setEditMode(false);
      toast({
        title: 'Success',
        description: 'Workspace updated successfully',
      });
    } catch (error) {
      console.error('Error updating workspace:', error);
      toast({
        title: 'Error',
        description: 'Failed to update workspace',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteWorkspace = async () => {
    try {
      await workspacesAPI.deleteWorkspace(workspaceId, user!.id);
      toast({
        title: 'Success',
        description: 'Workspace deleted successfully',
      });
      router.push('/workspaces');
    } catch (error) {
      console.error('Error deleting workspace:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete workspace',
        variant: 'destructive',
      });
    }
  };

  const handleInviteMember = async () => {
    try {
      setInviting(true);

      const response = await fetch('/api/workspaces/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workspaceId,
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send invitation');
      }

      setInviteEmail('');
      setInviteRole('member');

      await loadWorkspaceData();

      toast({
        title: 'Invitation Sent',
        description: result.isExistingUser
          ? 'User added to workspace successfully.'
          : 'Invitation email sent. User will be added to workspace after accepting the invitation.',
      });
    } catch (error) {
      console.error('Error inviting member:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to invite member',
        variant: 'destructive',
      });
    } finally {
      setInviting(false);
    }
  };

  const handleUpdateMemberRole = async (
    memberId: string,
    newRole: 'admin' | 'member' | 'viewer'
  ) => {
    try {
      await workspacesAPI.updateMemberRole(
        workspaceId,
        memberId,
        newRole,
        user!.id
      );
      loadWorkspaceData();
      toast({
        title: 'Success',
        description: 'Member role updated successfully',
      });
    } catch (error) {
      console.error('Error updating member role:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to update member role',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      await workspacesAPI.removeMember(workspaceId, memberId, user!.id);
      loadWorkspaceData();
      toast({
        title: 'Success',
        description: 'Member removed successfully',
      });
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to remove member',
        variant: 'destructive',
      });
    }
  };

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      await workspacesAPI.cancelInvitation(invitationId, user!.id);
      await loadWorkspaceData();
      toast({
        title: 'Success',
        description: 'Invitation cancelled successfully',
      });
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to cancel invitation',
        variant: 'destructive',
      });
    }
  };

  const handleResendInvitation = async (invitationId: string) => {
    try {
      await workspacesAPI.resendInvitation(invitationId, user!.id);
      toast({
        title: 'Success',
        description: 'Invitation resent successfully',
      });
    } catch (error) {
      console.error('Error resending invitation:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to resend invitation',
        variant: 'destructive',
      });
    }
  };

  if (!userProfile) {
    return null;
  }

  const currentUserMember = members.find(
    (m) => m.user?.clerk_user_id === user?.id
  );
  const isOwner = currentUserMember?.role === 'owner';
  const isAdmin = currentUserMember?.role === 'admin' || isOwner;
  const canEdit = isOwner || isAdmin;

  const ideaStats = {
    total: ideas.length,
    inception: ideas.filter((i) => i.phase === 'inception').length,
    refinement: ideas.filter((i) => i.phase === 'refinement').length,
    planning: ideas.filter((i) => i.phase === 'planning').length,
    execution_ready: ideas.filter((i) => i.phase === 'execution_ready').length,
  };

  if (loading) {
    return <WorkspaceSkeleton />;
  }

  if (!workspace) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Workspace not found</h2>
          <p className="text-muted-foreground">
            The workspace you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/workspaces">
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">{workspace.name}</h1>
            <Badge
              variant={workspace.type === 'personal' ? 'secondary' : 'default'}
            >
              {workspace.type}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {members.length} members • {ideas.length} ideas
          </p>
        </div>
        <RealtimeIndicator />
        <Button asChild>
          <Link href={`/dashboard/ideas/new?workspace=${workspaceId}`}>
            <Plus className="mr-2 h-4 w-4" />
            New Idea
          </Link>
        </Button>
        {canEdit && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditMode(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Workspace
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isOwner && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Workspace
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Workspace</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{workspace.name}"? This
                        action cannot be undone and will delete all ideas in
                        this workspace.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteWorkspace}
                        className="bg-destructive text-destructive-foreground"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="w-full space-y-6">
          {/* Workspace Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Ideas
                </CardTitle>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{ideaStats.total}</div>
                <p className="text-xs text-muted-foreground">
                  Across all phases
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  In Progress
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {ideaStats.refinement + ideaStats.planning}
                </div>
                <p className="text-xs text-muted-foreground">Being developed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Execution Ready
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {ideaStats.execution_ready}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ready to implement
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Team Members
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{members.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active collaborators
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="ideas" className="space-y-4">
            <TabsList>
              <TabsTrigger value="ideas">Ideas ({ideas.length})</TabsTrigger>
              <TabsTrigger value="members">
                Members ({members.length})
              </TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="ideas" className="space-y-4">
              {ideas.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {ideas.map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} />
                  ))}
                </div>
              ) : (
                <Card className="text-center p-12">
                  <div className="space-y-4">
                    <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                      <Lightbulb className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">No ideas yet</h3>
                      <p className="text-muted-foreground">
                        Start collaborating by creating the first idea in this
                        workspace
                      </p>
                    </div>
                    <Button asChild>
                      <Link
                        href={`/dashboard/ideas/new?workspace=${workspaceId}`}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create First Idea
                      </Link>
                    </Button>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="members" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Workspace Members</h3>
                {canEdit && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite New Member</DialogTitle>
                        <DialogDescription>
                          Invite someone to collaborate in this workspace
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter email address..."
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="role">Role</Label>
                          <Select
                            value={inviteRole}
                            onValueChange={(
                              value: 'admin' | 'member' | 'viewer'
                            ) => setInviteRole(value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="viewer">
                                Viewer - Can view ideas and comments
                              </SelectItem>
                              <SelectItem value="member">
                                Member - Can create and edit ideas
                              </SelectItem>
                              <SelectItem value="admin">
                                Admin - Can manage workspace and members
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={handleInviteMember}
                          disabled={inviting}
                        >
                          {inviting ? 'Sending...' : 'Send Invitation'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>

              <div className="space-y-6">
                {/* Current Members */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Current Members ({members.length})
                    </h4>
                  </div>
                  <div className="grid gap-4">
                    {members.map((member, index) => {
                      const RoleIcon =
                        roleIcons[member.role as keyof typeof roleIcons];
                      return (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Avatar>
                                  <AvatarImage
                                    src={
                                      member.user?.clerk_user_id === user?.id
                                        ? user?.imageUrl
                                        : member.user?.image_url ||
                                          '/placeholder.svg'
                                    }
                                  />
                                  <AvatarFallback>
                                    {member.user?.clerk_user_id === user?.id
                                      ? `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`
                                      : `${member.user?.first_name?.[0] || ''}${member.user?.last_name?.[0] || ''}`}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {member.user?.clerk_user_id === user?.id
                                      ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
                                      : `${member.user?.first_name || ''} ${member.user?.last_name || ''}`.trim()}
                                    {member.user?.clerk_user_id === user?.id &&
                                      ' (You)'}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {member.user?.clerk_user_id === user?.id
                                      ? user?.emailAddresses?.[0]?.emailAddress
                                      : member.user?.email}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={
                                    roleColors[
                                      member.role as keyof typeof roleColors
                                    ]
                                  }
                                >
                                  <RoleIcon className="mr-1 h-3 w-3" />
                                  {member.role}
                                </Badge>
                                {canEdit &&
                                  member.role !== 'owner' &&
                                  member.user?.clerk_user_id !== user?.id && (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleUpdateMemberRole(
                                              member.user!.id,
                                              'admin'
                                            )
                                          }
                                        >
                                          Make Admin
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleUpdateMemberRole(
                                              member.user!.id,
                                              'member'
                                            )
                                          }
                                        >
                                          Make Member
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleUpdateMemberRole(
                                              member.user!.id,
                                              'viewer'
                                            )
                                          }
                                        >
                                          Make Viewer
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleRemoveMember(member.user!.id)
                                          }
                                          className="text-destructive"
                                        >
                                          Remove from Workspace
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Pending Invitations */}
                {invitations.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <h4 className="text-sm font-medium text-muted-foreground">
                        Pending Invitations ({invitations.length})
                      </h4>
                    </div>
                    <div className="grid gap-4">
                      {invitations.map((invitation) => (
                        <Card
                          key={invitation.id}
                          className="border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20"
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                                  <Mail className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {invitation.email}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Invited as {invitation.role} • Expires{' '}
                                    {new Date(
                                      invitation.expires_at
                                    ).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={
                                    roleColors[
                                      invitation.role as keyof typeof roleColors
                                    ]
                                  }
                                >
                                  {(() => {
                                    const RoleIcon =
                                      roleIcons[
                                        invitation.role as keyof typeof roleIcons
                                      ];
                                    return (
                                      <RoleIcon className="mr-1 h-3 w-3" />
                                    );
                                  })()}
                                  {invitation.role}
                                </Badge>
                                {canEdit && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleResendInvitation(invitation.id)
                                        }
                                      >
                                        <Mail className="mr-2 h-4 w-4" />
                                        Resend Invitation
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() =>
                                          handleCancelInvitation(invitation.id)
                                        }
                                        className="text-destructive"
                                      >
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Cancel Invitation
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {members.length === 0 && invitations.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No Members Yet
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Start building your team by inviting members to
                      collaborate
                    </p>
                    {canEdit && (
                      <Button>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite First Member
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Workspace Settings</CardTitle>
                  <CardDescription>
                    Manage workspace details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editMode ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Workspace Name</Label>
                        <Input
                          id="edit-name"
                          value={editData.name}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-description">Description</Label>
                        <Textarea
                          id="edit-description"
                          value={editData.description}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-type">Type</Label>
                        <Select
                          value={editData.type}
                          onValueChange={(value: 'personal' | 'team') =>
                            setEditData((prev) => ({ ...prev, type: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="team">Team</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleUpdateWorkspace}>
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditMode(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <Label>Workspace Name</Label>
                        <p className="text-sm">{workspace.name}</p>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <p className="text-sm text-muted-foreground">
                          {workspace.description || 'No description provided'}
                        </p>
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Badge
                          variant={
                            workspace.type === 'personal'
                              ? 'secondary'
                              : 'default'
                          }
                        >
                          {workspace.type}
                        </Badge>
                      </div>
                      <div>
                        <Label>Created</Label>
                        <p className="text-sm">
                          {new Date(workspace.created_at!).toLocaleDateString()}
                        </p>
                      </div>
                      {canEdit && (
                        <Button onClick={() => setEditMode(true)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Settings
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
