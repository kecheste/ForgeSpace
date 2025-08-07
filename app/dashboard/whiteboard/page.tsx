'use client';

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
import { WhiteboardSkeleton } from '@/components/ui/loading-skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { whiteboardsAPI } from '@/lib/api/whiteboards';
import { workspacesAPI } from '@/lib/api/workspaces';
import { useUser } from '@clerk/nextjs';
import {
  Building2,
  Calendar,
  Clock,
  Download,
  Eye,
  Filter,
  Lightbulb,
  MoreVertical,
  Palette,
  Plus,
  Search,
  Share2,
  Sparkles,
  Trash2,
  User,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

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

type Workspace = {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export default function WhiteboardPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [canvases, setCanvases] = useState<WhiteboardCanvas[]>([]);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedType, setSelectedType] = useState<string>('mindmap');
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('');
  const [newCanvasName, setNewCanvasName] = useState('');
  const [newCanvasDescription, setNewCanvasDescription] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [deletingCanvas, setDeletingCanvas] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadCanvases();
    }
  }, [user]);

  const loadCanvases = async () => {
    try {
      setLoading(true);

      const [canvasesData, workspacesData] = await Promise.all([
        whiteboardsAPI.getCanvases(user!.id),
        workspacesAPI.getWorkspaces(user!.id),
      ]);

      setCanvases(canvasesData || []);
      setWorkspaces(workspacesData || []);

      if (workspacesData && workspacesData.length > 0 && !selectedWorkspace) {
        setSelectedWorkspace(workspacesData[0].id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load whiteboards. Please try again.',
        variant: 'destructive',
      });
      setCanvases([]);
      setWorkspaces([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCanvas = async () => {
    if (!newCanvasName.trim() || !user || !selectedWorkspace) {
      toast({
        title: 'Missing Information',
        description: 'Please select a workspace and enter a canvas name.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const newCanvas = await whiteboardsAPI.createCanvas(
        {
          name: newCanvasName,
          description: newCanvasDescription,
          type: selectedType as
            | 'mindmap'
            | 'flowchart'
            | 'timeline'
            | 'freeform',
          workspace_id: selectedWorkspace,
          created_by: user.id,
        },
        user.id
      );

      if (newCanvas) {
        setCanvases([newCanvas, ...canvases]);
        setNewCanvasName('');
        setNewCanvasDescription('');
        setShowCreateDialog(false);
        toast({
          title: 'Success',
          description: 'Canvas created successfully!',
        });
      }
    } catch (error) {
      console.error('Error creating canvas:', error);
      toast({
        title: 'Error',
        description: `Failed to create canvas: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCanvas = async (canvasId: string) => {
    try {
      await whiteboardsAPI.deleteCanvas(canvasId);
      setCanvases(canvases.filter((c) => c.id !== canvasId));
      toast({
        title: 'Success',
        description: 'Canvas deleted successfully!',
      });
    } catch (error) {
      console.error('Error deleting canvas:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete canvas. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingCanvas(null);
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = canvasTypes.find((t) => t.value === type);
    return typeConfig?.icon || Palette;
  };

  const getTypeColor = (type: string) => {
    const typeConfig = canvasTypes.find((t) => t.value === type);
    return typeConfig?.color || 'bg-gray-500';
  };

  const filteredCanvases = useMemo(() => {
    let filtered = canvases;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (canvas) =>
          canvas.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (canvas.description &&
            canvas.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by type
    if (selectedFilter !== 'all') {
      filtered = filtered.filter((canvas) => canvas.type === selectedFilter);
    }

    return filtered;
  }, [canvases, searchQuery, selectedFilter]);

  const getCollaboratorCount = (canvas: WhiteboardCanvas) => {
    return canvas.whiteboard_collaborators?.length || 0;
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

  if (loading) {
    return <WhiteboardSkeleton />;
  }

  if (deletingCanvas) {
    return <Skeleton />;
  }
  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Visual Idea Board</h1>
          <p className="text-sm text-muted-foreground">
            Brainstorm, map concepts, and visualize ideas with collaborative
            whiteboards
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Canvas
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Canvas</DialogTitle>
              <DialogDescription>
                Choose a canvas type and give it a name to start visualizing
                your ideas
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Workspace</label>
                <Select
                  value={selectedWorkspace}
                  onValueChange={setSelectedWorkspace}
                >
                  <SelectTrigger className="w-[100%]">
                    <SelectValue placeholder="Select a workspace" />
                  </SelectTrigger>
                  <SelectContent>
                    {workspaces.map((workspace) => (
                      <SelectItem key={workspace.id} value={workspace.id}>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <div>
                            <div className="font-medium">{workspace.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {workspace.description}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {workspaces.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    No workspaces found.{' '}
                    <Link
                      href="/dashboard/workspaces/new"
                      className="text-primary hover:underline"
                    >
                      Create a workspace first
                    </Link>
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Canvas Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[100%]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {canvasTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {type.description}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Canvas Name</label>
                <Input
                  placeholder="Enter canvas name"
                  value={newCanvasName}
                  onChange={(e) => setNewCanvasName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium">
                  Description (Optional)
                </label>
                <Textarea
                  placeholder="Describe what this canvas is for..."
                  value={newCanvasDescription}
                  onChange={(e) => setNewCanvasDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <Button
                onClick={handleCreateCanvas}
                disabled={!newCanvasName.trim() || !selectedWorkspace}
              >
                Create Canvas
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="w-full space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Canvases
                </CardTitle>
                <Palette className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{canvases.length}</div>
                <p className="text-xs text-muted-foreground">
                  Active visual boards
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mind Maps</CardTitle>
                <Lightbulb className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {canvases.filter((c) => c.type === 'mindmap').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Concept mappings
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Flow Charts
                </CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {canvases.filter((c) => c.type === 'flowchart').length}
                </div>
                <p className="text-xs text-muted-foreground">Process flows</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Collaborators
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {canvases.reduce(
                    (sum, c) => sum + getCollaboratorCount(c),
                    0
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active participants
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search canvases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {canvasTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Canvas Grid */}
          {filteredCanvases.length === 0 ? (
            <Card className="flex flex-col items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="rounded-full bg-muted p-4">
                  <Palette className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">No canvases found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery || selectedFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'Create your first canvas to start visualizing ideas'}
                  </p>
                </div>
                {!searchQuery && selectedFilter === 'all' && (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Canvas
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCanvases.map((canvas) => (
                <Card
                  key={canvas.id}
                  className="group hover:shadow-lg transition-all duration-200"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center ${getTypeColor(canvas.type)}`}
                        >
                          {(() => {
                            const Icon = getTypeIcon(canvas.type);
                            return <Icon className="h-5 w-5 text-white" />;
                          })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate">
                            {canvas.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {canvas.description || 'No description'}
                          </CardDescription>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/whiteboard/${canvas.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Open Canvas
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-destructive"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Canvas
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{canvas.name}
                                  "? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCanvas(canvas.id)}
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
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {getCollaboratorCount(canvas)} collaborators
                        </span>
                        {canvas.workspace && (
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3 w-3" />
                            {canvas.workspace.name}
                          </span>
                        )}
                      </div>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(canvas.updated_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {getCreatorName(canvas)}
                      </span>
                      {canvas.idea && (
                        <span className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          {canvas.idea.title}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1" asChild>
                        <Link href={`/dashboard/whiteboard/${canvas.id}`}>
                          <Eye className="mr-2 h-3 w-3" />
                          Open Canvas
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
