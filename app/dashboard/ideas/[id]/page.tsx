'use client';

import { RealtimeIndicator } from '@/components/realtime-indicator';
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
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { ideasAPI } from '@/lib/api/ideas';
import { usersAPI } from '@/lib/api/users';
import { useRealtimeIdea } from '@/lib/hooks/use-realtime';
import { useUser } from '@clerk/nextjs';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Edit,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Idea = {
  id: string;
  title: string;
  description: string;
  phase: 'inception' | 'refinement' | 'planning' | 'execution_ready';
  tags: string[];
  created_at: string;
  updated_at: string;
  created_by: string;
  workspace_id: string;
  idea_id?: string;
  workspace?: {
    id: string;
    name: string;
  };
  idea_phases?: IdeaPhase[];
  comments?: IdeaComment[];
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    image_url: string;
  };
};

type IdeaPhase = {
  phase: 'inception' | 'refinement' | 'planning' | 'execution_ready';
  content: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  workspace_id: string;
  idea_id: string;
};

type IdeaComment = {
  id: string;
  phase: 'inception' | 'refinement' | 'planning' | 'execution_ready';
  user: {
    id: string;
    first_name: string;
    last_name: string;
    image_url: string;
  };
  content: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  workspace_id: string;
  idea_id: string;
};

export default function IdeaDetailPage() {
  const params = useParams();
  const { user } = useUser();
  const ideaId = params.id as string;
  const [idea, setIdea] = useState<Idea | null>(null);
  const [phases, setPhases] = useState<IdeaPhase[]>([]);
  const [comments, setComments] = useState<IdeaComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [activePhase, setActivePhase] = useState('inception');
  type UserProfile = {
    id: string;
    clerk_user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    image_url: string;
  };
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Real-time updates
  const { activeUsers } = useRealtimeIdea(ideaId);

  useEffect(() => {
    if (user && ideaId) {
      loadIdeaData();
    }
  }, [user, ideaId]);

  const loadIdeaData = async () => {
    try {
      const profile = await usersAPI.createOrUpdateProfile({
        clerk_user_id: user!.id,
        email: user!.emailAddresses[0]?.emailAddress || '',
        first_name: user!.firstName,
        last_name: user!.lastName,
        image_url: user!.imageUrl,
      });
      setUserProfile(profile);

      const ideaData = await ideasAPI.getIdea(ideaId);
      setIdea(ideaData);
      setPhases(ideaData.idea_phases || []);
      setComments(ideaData.comments || []);
      setActivePhase(ideaData.phase || 'inception');
    } catch (error) {
      console.error('Error loading idea:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !userProfile) return;

    try {
      const comment = await ideasAPI.addComment(
        ideaId,
        newComment,
        activePhase,
        userProfile.id
      );
      setComments((prev) => [...prev, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUpdatePhase = async (phase: string, content: string) => {
    try {
      await ideasAPI.updatePhase(ideaId, phase, content);
      setPhases((prev) =>
        prev.map((p) => (p.phase === phase ? { ...p, content } : p))
      );
    } catch (error) {
      console.error('Error updating phase:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading idea...</p>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Idea not found</h2>
          <p className="text-muted-foreground">
            The idea you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const phaseOrder = ['inception', 'refinement', 'planning', 'execution_ready'];
  const currentPhaseIndex = phaseOrder.indexOf(activePhase);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/ideas">
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">{idea.title}</h1>
            <Badge className="bg-yellow-100 text-yellow-800">
              {idea.phase}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {idea.workspace?.name} • Created{' '}
            {new Date(idea.created_at).toLocaleDateString()}
          </p>
        </div>
        <RealtimeIndicator activeUsers={activeUsers} />
        <Button size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="w-full space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>{idea.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {idea.tags?.map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Phase Tabs */}
          <Tabs
            value={activePhase}
            onValueChange={setActivePhase}
            className="space-y-4"
          >
            <TabsList className="grid w-full grid-cols-4">
              {phaseOrder.map((phase, index) => {
                const phaseData = phases.find((p) => p.phase === phase);
                const isCompleted = phaseData?.completed;
                const isCurrent = index === currentPhaseIndex;

                return (
                  <TabsTrigger
                    key={phase}
                    value={phase}
                    className="flex items-center gap-2"
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : isCurrent ? (
                      <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-gray-300" />
                    )}
                    {phase.charAt(0).toUpperCase() +
                      phase.slice(1).replace('_', ' ')}
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {phaseOrder.map((phase) => {
              const phaseData = phases.find((p) => p.phase === phase);
              const phaseComments = comments.filter((c) => c.phase === phase);

              return (
                <TabsContent key={phase} value={phase} className="space-y-4">
                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            {phase.charAt(0).toUpperCase() +
                              phase.slice(1).replace('_', ' ')}{' '}
                            Phase
                            {phaseData?.completed && (
                              <Badge className="bg-green-100 text-green-800">
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Completed
                              </Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <Textarea
                            placeholder={`Add content for the ${phase} phase...`}
                            className="min-h-[200px]"
                            value={phaseData?.content || ''}
                            onChange={(e) =>
                              handleUpdatePhase(phase, e.target.value)
                            }
                          />
                          <div className="flex justify-between">
                            <Button variant="outline">Save Draft</Button>
                            <div className="flex gap-2">
                              {currentPhaseIndex > 0 && (
                                <Button variant="outline">
                                  <ArrowLeft className="mr-2 h-4 w-4" />
                                  Previous Phase
                                </Button>
                              )}
                              {currentPhaseIndex < phaseOrder.length - 1 && (
                                <Button>
                                  Next Phase
                                  <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-base">
                            <Sparkles className="h-4 w-4 text-purple-500" />
                            AI Suggestions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-start gap-2 text-sm">
                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                            <span>
                              Consider defining the target audience more
                              specifically
                            </span>
                          </div>
                          <div className="flex items-start gap-2 text-sm">
                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                            <span>
                              Research existing solutions in the market
                            </span>
                          </div>
                          <Button size="sm" className="w-full mt-3">
                            <Sparkles className="mr-2 h-3 w-3" />
                            Get More Suggestions
                          </Button>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            Phase Comments
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {phaseComments.map((comment) => (
                            <div key={comment.id} className="space-y-2">
                              <div className="flex items-start gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={
                                      comment.user?.image_url ||
                                      '/placeholder.svg'
                                    }
                                  />
                                  <AvatarFallback className="text-xs">
                                    {comment.user?.first_name?.charAt(0)}
                                    {comment.user?.last_name?.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center gap-2 text-xs">
                                    <span className="font-medium">
                                      {comment.user?.first_name}{' '}
                                      {comment.user?.last_name}
                                    </span>
                                    <span className="text-muted-foreground">
                                      {new Date(
                                        comment.created_at
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                          <Separator />
                          <div className="flex gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={user?.imageUrl || '/placeholder.svg'}
                              />
                              <AvatarFallback className="text-xs">
                                {user?.firstName?.charAt(0)}
                                {user?.lastName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <Textarea
                              placeholder="Add a comment..."
                              className="min-h-[60px] text-sm"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                            />
                          </div>
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={handleAddComment}
                          >
                            <MessageCircle className="mr-2 h-3 w-3" />
                            Add Comment
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
