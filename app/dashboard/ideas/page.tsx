'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageSkeleton } from '@/components/ui/loading-skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ideasAPI } from '@/lib/api/ideas';
import { usersAPI } from '@/lib/api/users';
import { useUser } from '@clerk/nextjs';
import {
  Calendar,
  Filter,
  MessageCircle,
  Plus,
  Search,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const phaseColors = {
  inception: 'bg-blue-100 text-blue-800',
  refinement: 'bg-yellow-100 text-yellow-800',
  planning: 'bg-orange-100 text-orange-800',
  execution_ready: 'bg-green-100 text-green-800',
};

function IdeaCard({ idea }: { idea: Idea }) {
  return (
    <Card className="hover:border-primary transition-colors">
      <Link href={`/dashboard/ideas/${idea.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base line-clamp-2">
              {idea.title}
            </CardTitle>
            <Badge
              variant="outline"
              className={
                phaseColors[idea.phase as keyof typeof phaseColors] ||
                'bg-gray-100 text-gray-800'
              }
            >
              {idea.phase.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {idea.description}
          </p>

          <div className="flex flex-wrap gap-1 mb-3">
            {idea.tags?.map((tag: string) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />1
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />0
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(idea.updated_at).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}

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
};

export default function IdeasPage() {
  const { user, isLoaded } = useUser();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (isLoaded && user) {
      loadIdeas();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
  }, [user, isLoaded]);

  const loadIdeas = async () => {
    try {
      setError(null);
      const profile = await usersAPI.createOrUpdateProfile({
        clerk_user_id: user!.id,
        email: user!.emailAddresses[0]?.emailAddress || '',
        first_name: user!.firstName || '',
        last_name: user!.lastName || '',
        image_url: user!.imageUrl || '',
      });

      setUserProfile(profile);

      const ideasData = await ideasAPI.getIdeas(undefined, profile.id);
      setIdeas(ideasData || []);
    } catch (error) {
      console.error('Error loading ideas:', error);
      setError('Failed to load ideas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userProfile) {
      loadIdeas();
    }
  }, [userProfile]);

  const groupedIdeas = {
    inception: ideas.filter((idea) => idea.phase === 'inception'),
    refinement: ideas.filter((idea) => idea.phase === 'refinement'),
    planning: ideas.filter((idea) => idea.phase === 'planning'),
    execution_ready: ideas.filter((idea) => idea.phase === 'execution_ready'),
  };

  if (!isLoaded || loading) {
    return <PageSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Ideas</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={loadIdeas} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur">
        <div className="flex-1">
          <h1 className="text-lg font-medium">Ideas</h1>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/ideas/new">
            <Plus className="mr-2 h-4 w-4" />
            New Idea
          </Link>
        </Button>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="w-full space-y-6">
          {/* Search and Filters */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search ideas..." className="pl-10" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Ideas by Phase */}
          <Tabs defaultValue="all">
            <TabsList className="w-full overflow-x-auto">
              <TabsTrigger value="all">All ({ideas.length})</TabsTrigger>
              <TabsTrigger value="inception">
                Inception ({groupedIdeas.inception.length})
              </TabsTrigger>
              <TabsTrigger value="refinement">
                Refinement ({groupedIdeas.refinement.length})
              </TabsTrigger>
              <TabsTrigger value="planning">
                Planning ({groupedIdeas.planning.length})
              </TabsTrigger>
              <TabsTrigger value="ready">
                Ready ({groupedIdeas.execution_ready.length})
              </TabsTrigger>
            </TabsList>

            <div className="pt-4">
              <TabsContent value="all">
                {ideas.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {ideas.map((idea) => (
                      <IdeaCard key={idea.id} idea={idea} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium">No ideas yet</h3>
                    <p className="mb-4 text-muted-foreground max-w-md">
                      Start by creating your first idea
                    </p>
                    <Button asChild>
                      <Link href="/dashboard/ideas/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Idea
                      </Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="inception">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {groupedIdeas.inception.map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="refinement">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {groupedIdeas.refinement.map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="planning">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {groupedIdeas.planning.map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="ready">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {groupedIdeas.execution_ready.map((idea) => (
                    <IdeaCard key={idea.id} idea={idea} />
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
