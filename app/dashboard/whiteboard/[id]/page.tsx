'use client';

import { TldrawCanvas } from '@/components/tldraw-canvas';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { whiteboardsAPI } from '@/lib/api/whiteboards';
import { useUser } from '@clerk/nextjs';
import { TLStoreSnapshot } from '@tldraw/tldraw';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Copy,
  Download,
  Edit,
  FileText,
  History,
  Lightbulb,
  Link as LinkIcon,
  MoreVertical,
  Palette,
  Plus,
  Save,
  Share2,
  Sparkles,
  Trash2,
  Users2,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface WhiteboardCanvas {
  id: string;
  name: string;
  description: string | null;
  type: 'mindmap' | 'flowchart' | 'timeline' | 'freeform';
  workspace_id: string;
  idea_id: string | null;
  created_by: string;
  canvas_data: unknown;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  workspace?: {
    name: string;
    description: string | null;
  };
  idea?: {
    title: string;
  };
  created_by_profile?: {
    first_name: string | null;
    last_name: string | null;
    image_url: string | null;
  };
  whiteboard_collaborators?: Array<{
    user: {
      first_name: string | null;
      last_name: string | null;
      image_url: string | null;
    };
    role: 'owner' | 'editor' | 'viewer';
  }>;
  whiteboard_versions?: Array<{
    version_number: number;
    created_at: string;
    created_by_profile: {
      first_name: string | null;
      last_name: string | null;
    };
  }>;
}

const canvasTypes = [
  {
    value: 'mindmap',
    label: 'Mind Map',
    icon: Lightbulb,
    description: 'Visual concept mapping and brainstorming',
    color: 'bg-blue-500',
  },
  {
    value: 'flowchart',
    label: 'Flow Chart',
    icon: Zap,
    description: 'Process flows and decision trees',
    color: 'bg-green-500',
  },
  {
    value: 'timeline',
    label: 'Timeline',
    icon: Calendar,
    description: 'Project timelines and milestones',
    color: 'bg-purple-500',
  },
  {
    value: 'freeform',
    label: 'Freeform',
    icon: Palette,
    description: 'Creative whiteboard for any visual content',
    color: 'bg-orange-500',
  },
];

export default function WhiteboardCanvasPage() {
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const canvasId = params.id as string;

  const [canvas, setCanvas] = useState<WhiteboardCanvas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [canvasName, setCanvasName] = useState('');
  const [canvasDescription, setCanvasDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [shareRole, setShareRole] = useState<'editor' | 'viewer'>('viewer');

  useEffect(() => {
    if (user && canvasId) {
      loadCanvas();
    }
  }, [user, canvasId]);

  const loadCanvas = async () => {
    try {
      setLoading(true);
      setError(null);

      const canvasData = await whiteboardsAPI.getCanvas(canvasId);
      setCanvas(canvasData);
      setCanvasName(canvasData.name);
      setCanvasDescription(canvasData.description || '');
    } catch (error) {
      console.error('Error loading canvas:', error);
      setError('Failed to load canvas. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load canvas. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCanvas = async () => {
    if (!canvas) return;

    try {
      setSaving(true);
      await whiteboardsAPI.updateCanvas(canvas.id, {
        name: canvasName,
        description: canvasDescription,
      });

      setCanvas({
        ...canvas,
        name: canvasName,
        description: canvasDescription,
        updated_at: new Date().toISOString(),
      });
      setIsEditing(false);

      toast({
        title: 'Success',
        description: 'Canvas updated successfully!',
      });
    } catch (error) {
      console.error('Error updating canvas:', error);
      toast({
        title: 'Error',
        description: 'Failed to update canvas. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveCanvasData = async (data: TLStoreSnapshot) => {
    if (!canvas || !user) return;

    try {
      await whiteboardsAPI.saveCanvasData(canvas.id, data, user.id);
      setCanvas({
        ...canvas,
        canvas_data: data as unknown,
        updated_at: new Date().toISOString(),
      });

      toast({
        title: 'Saved',
        description: 'Canvas data saved successfully!',
      });
    } catch (error) {
      console.error('Error saving canvas data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save canvas data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShareCanvas = async () => {
    if (!shareEmail.trim()) {
      toast({
        title: 'Missing Email',
        description: 'Please enter an email address.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await whiteboardsAPI.addCollaborator(canvas!.id, shareEmail, shareRole);
      setShowShareDialog(false);
      setShareEmail('');
      setShareRole('viewer');

      // Reload canvas to get updated collaborators
      await loadCanvas();

      toast({
        title: 'Success',
        description: `Invitation sent to ${shareEmail}`,
      });
    } catch (error) {
      console.error('Error sharing canvas:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to share canvas.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCanvas = async () => {
    if (!canvas) return;

    try {
      await whiteboardsAPI.deleteCanvas(canvas.id);
      toast({
        title: 'Success',
        description: 'Canvas deleted successfully!',
      });
      router.push('/whiteboard');
    } catch (error) {
      console.error('Error deleting canvas:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete canvas. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = canvasTypes.find((t) => t.value === type);
    return typeConfig?.icon || Palette;
  };

  const getTypeLabel = (type: string) => {
    const typeConfig = canvasTypes.find((t) => t.value === type);
    return typeConfig?.label || 'Unknown';
  };

  const getTypeColor = (type: string) => {
    const typeConfig = canvasTypes.find((t) => t.value === type);
    return typeConfig?.color || 'bg-gray-500';
  };

  const getCreatorName = (canvas: WhiteboardCanvas) => {
    if (canvas.created_by_profile) {
      const { first_name, last_name } = canvas.created_by_profile;
      if (first_name && last_name) {
        return `${first_name} ${last_name}`;
      } else if (first_name) {
        return first_name;
      } else if (last_name) {
        return last_name;
      }
    }
    return 'Unknown User';
  };

  const getCollaboratorCount = (canvas: WhiteboardCanvas) => {
    return canvas.whiteboard_collaborators?.length || 0;
  };

  const getOnlineCollaborators = (canvas: WhiteboardCanvas) => {
    return canvas.whiteboard_collaborators?.filter((c) => c.user) || [];
  };

  if (loading) {
    return (
      <div className="flex h-screen flex-col">
        <header className="flex h-16 items-center gap-4 border-b px-6">
          <Skeleton className="h-8 w-32" />
          <div className="flex-1">
            <Skeleton className="h-6 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </header>
        <div className="flex-1 flex">
          <div className="flex-1 p-6">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
          <div className="w-80 border-l p-4">
            <Skeleton className="h-8 w-full mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !canvas) {
    return (
      <div className="flex h-screen flex-col">
        <header className="flex h-16 items-center gap-4 border-b px-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/whiteboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Whiteboards
            </Link>
          </Button>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="rounded-full bg-destructive/10 p-4 mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Canvas not found</h2>
            <p className="text-muted-foreground mb-4">
              {error ||
                "The whiteboard canvas you're looking for doesn't exist."}
            </p>
            <Button asChild>
              <Link href="/dashboard/whiteboard">Back to Whiteboards</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/whiteboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            {isEditing ? (
              <input
                value={canvasName}
                onChange={(e) => setCanvasName(e.target.value)}
                className="text-xl font-semibold *:placeholder:text-muted-foreground p-0 pl-2 border-1 border-gray-400 rounded-sm focus:border-blue-500 focus:ring-0 transition-all duration-300"
              />
            ) : (
              <h1 className="text-xl font-semibold">{canvas.name}</h1>
            )}
            <Badge className={`${getTypeColor(canvas.type)} text-white`}>
              {getTypeLabel(canvas.type)}
            </Badge>
          </div>
          {isEditing ? (
            <input
              value={canvasDescription}
              onChange={(e) => setCanvasDescription(e.target.value)}
              className="text-sm text-muted-foreground mt-1 p-0 pl-2 border-1 border-gray-300 rounded-xs focus:border-blue-400 transition-all duration-300 w-1/2"
              placeholder="Canvas description..."
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {canvas.description || 'No description'}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Share2 className="mr-2 h-3 w-3" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Canvas</DialogTitle>
                <DialogDescription>
                  Invite others to collaborate on this canvas
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email address</label>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Select
                    value={shareRole}
                    onValueChange={(value: 'editor' | 'viewer') =>
                      setShareRole(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editor">
                        Editor - Can edit the canvas
                      </SelectItem>
                      <SelectItem value="viewer">
                        Viewer - Can only view the canvas
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleShareCanvas} className="w-full">
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSaveCanvas} disabled={saving}>
                <Save className="mr-2 h-3 w-3" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="mr-2 h-3 w-3" />
              Edit
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <MoreVertical className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Export as Image
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Canvas
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Canvas</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{canvas.name}"? This
                      action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteCanvas}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6">
            <TldrawCanvas
              canvasId={canvasId}
              initialData={canvas.canvas_data as TLStoreSnapshot | null}
              onSave={handleSaveCanvasData}
              onShare={() => setShowShareDialog(true)}
              onExport={(type) => console.log(`Export canvas as ${type}`)}
              isReadOnly={false}
              collaborators={getOnlineCollaborators(canvas).map((c) => ({
                id: c.user.first_name || 'user',
                name:
                  `${c.user.first_name || ''} ${c.user.last_name || ''}`.trim() ||
                  'Unknown User',
                color: '#3B82F6',
                isOnline: true,
              }))}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l bg-gray-50">
          <Tabs defaultValue="canvas" className="h-full">
            <TabsList className="w-full rounded-none border-b">
              <TabsTrigger value="canvas" className="flex-1">
                Canvas
              </TabsTrigger>
              <TabsTrigger value="collaborators" className="flex-1">
                Team
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1">
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="canvas" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Canvas Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Type</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className={`h-6 w-6 rounded flex items-center justify-center ${getTypeColor(canvas.type)}`}
                      >
                        {(() => {
                          const Icon = getTypeIcon(canvas.type);
                          return <Icon className="h-3 w-3 text-white" />;
                        })()}
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">
                        {getTypeLabel(canvas.type)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Created by</label>
                    <p className="text-sm text-muted-foreground">
                      {getCreatorName(canvas)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last updated</label>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(canvas.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  {canvas.workspace && (
                    <div>
                      <label className="text-sm font-medium">Workspace</label>
                      <p className="text-sm text-muted-foreground">
                        {canvas.workspace.name}
                      </p>
                    </div>
                  )}
                  {canvas.idea && (
                    <div>
                      <label className="text-sm font-medium">
                        Linked to idea
                      </label>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        {canvas.idea.title}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <LinkIcon className="mr-2 h-3 w-3" />
                    Link to Idea
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Download className="mr-2 h-3 w-3" />
                    Export as Image
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                  >
                    <FileText className="mr-2 h-3 w-3" />
                    Export as PDF
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="collaborators" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Active Collaborators
                  </CardTitle>
                  <CardDescription>
                    {getCollaboratorCount(canvas)} people have access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getOnlineCollaborators(canvas).map(
                      (collaborator, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={collaborator.user.image_url || undefined}
                            />
                            <AvatarFallback>
                              {collaborator.user.first_name?.[0]}
                              {collaborator.user.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {collaborator.user.first_name}{' '}
                              {collaborator.user.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {collaborator.role}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1"
                          >
                            <CheckCircle className="h-3 w-3" />
                            Online
                          </Badge>
                        </div>
                      )
                    )}
                    {getOnlineCollaborators(canvas).length === 0 && (
                      <div className="text-center py-4">
                        <Users2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No collaborators yet
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Invite Collaborators
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input
                    placeholder="Enter email address"
                    value={shareEmail}
                    onChange={(e) => setShareEmail(e.target.value)}
                  />
                  <Select
                    value={shareRole}
                    onValueChange={(value: 'editor' | 'viewer') =>
                      setShareRole(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={handleShareCanvas}
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    Invite
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Version History</CardTitle>
                  <CardDescription>
                    Recent changes to this canvas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {canvas.whiteboard_versions
                      ?.slice(0, 5)
                      .map((version, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <History className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              Canvas updated
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(
                                version.created_at
                              ).toLocaleDateString()}{' '}
                              by {version.created_by_profile.first_name}{' '}
                              {version.created_by_profile.last_name}
                            </p>
                          </div>
                        </div>
                      ))}
                    {(!canvas.whiteboard_versions ||
                      canvas.whiteboard_versions.length === 0) && (
                      <div className="text-center py-4">
                        <History className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          No version history yet
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
