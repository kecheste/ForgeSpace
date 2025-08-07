'use client';

import { useWorkspace } from '@/components/providers/workspace-provider';
import { RealtimeIndicator } from '@/components/realtime-indicator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DashboardSkeleton } from '@/components/ui/loading-skeleton';
import { ideasAPI } from '@/lib/api/ideas';
import {
  ArrowRight,
  BarChart3,
  Brain,
  Building2,
  CheckCircle,
  Lightbulb,
  Plus,
  Target,
  Users,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const phaseStats = [
  {
    phase: 'Inception',
    count: 0,
    icon: Lightbulb,
    color: 'text-blue-500',
    description: 'Basic concepts',
  },
  {
    phase: 'Refinement',
    count: 0,
    icon: Users,
    color: 'text-yellow-500',
    description: 'Collaborative development',
  },
  {
    phase: 'Planning',
    count: 0,
    icon: Target,
    color: 'text-orange-500',
    description: 'Technical specs',
  },
  {
    phase: 'Execution',
    count: 0,
    icon: CheckCircle,
    color: 'text-green-500',
    description: 'Ready to implement',
  },
];

const platformPillars = [
  {
    title: 'Idea Manager',
    description: 'Guide ideas from concept to implementation',
    icon: Brain,
    color: 'text-purple-500',
    href: '/dashboard/ideas',
  },
  {
    title: 'Workspaces',
    description: 'Collaborative spaces for teams',
    icon: Users,
    color: 'text-blue-500',
    href: '/dashboard/workspaces',
  },
  {
    title: 'AI Analysis',
    description: 'Assess viability and development potential',
    icon: BarChart3,
    color: 'text-green-500',
    href: '/dashboard/analyzer',
  },
  {
    title: 'Tools',
    description: 'Essential development tools',
    icon: Wrench,
    color: 'text-orange-500',
    href: '/dashboard/tools',
  },
];

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
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    image_url: string;
  };
};

export default function Dashboard() {
  const { userProfile, loading: workspaceLoading } = useWorkspace();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [stats, setStats] = useState(phaseStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      loadDashboardData();
    }
  }, [userProfile]);

  const loadDashboardData = async () => {
    try {
      setError(null);
      const ideasData =
        userProfile && (await ideasAPI.getIdeas(undefined, userProfile.id));
      setIdeas(ideasData || []);

      const newStats = phaseStats.map((stat) => ({
        ...stat,
        count:
          ideasData?.filter(
            (idea: Idea) => idea.phase === stat.phase.toLowerCase()
          ).length || 0,
      }));
      setStats(newStats);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading || workspaceLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error Loading Dashboard</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={loadDashboardData} className="w-full">
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
          <h1 className="text-lg font-medium">Dashboard</h1>
        </div>
        <RealtimeIndicator />
        <Button asChild size="sm">
          <Link href="/dashboard/ideas/new">
            <Plus className="mr-2 h-4 w-4" />
            New Idea
          </Link>
        </Button>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="space-y-8">
          {/* Welcome Section */}
          {ideas.length === 0 && (
            <Card className="border-0 shadow-none">
              <CardHeader>
                <CardTitle className="text-xl">Welcome to ForgeSpace</CardTitle>
                <CardDescription>
                  Start by creating your first idea or workspace
                </CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button asChild>
                  <Link href="/dashboard/ideas/new">
                    <Plus className="mr-2 h-4 w-4" />
                    New Idea
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/dashboard/workspaces/new">
                    <Building2 className="mr-2 h-4 w-4" />
                    New Workspace
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Platform Features */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-medium">Core Features</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/tools">View All</Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {platformPillars.map((pillar) => (
                <Card
                  key={pillar.title}
                  className="hover:border-primary transition-colors"
                >
                  <Link href={pillar.href}>
                    <CardHeader className="pb-3">
                      <div
                        className={`mb-2 h-10 w-10 rounded-lg flex items-center justify-center ${pillar.color} bg-opacity-10`}
                      >
                        <pillar.icon className={`h-5 w-5 ${pillar.color}`} />
                      </div>
                      <CardTitle className="text-base">
                        {pillar.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {pillar.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center text-sm font-medium text-primary">
                        Explore <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>

          {/* Idea Stats */}
          <div>
            <h2 className="mb-4 text-lg font-medium">
              Idea Development Status
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.phase}>
                  <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                    <div>
                      <p className="text-sm font-medium">{stat.phase}</p>
                      <p className="text-xs text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>
                    <div className={`p-2 ${stat.color}`}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-semibold">{stat.count}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          {ideas.length > 0 && (
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Ideas</CardTitle>
                    <CardDescription>
                      Your most recently updated ideas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {ideas.slice(0, 5).map((idea) => (
                      <div
                        key={idea.id}
                        className="rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                      >
                        <Link
                          href={`/dashboard/ideas/${idea.id}`}
                          className="block"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{idea.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {idea.description}
                              </p>
                            </div>
                            <Badge variant="outline">{idea.phase}</Badge>
                          </div>
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <Building2 className="h-3 w-3" />
                            <span>{idea.workspace?.name || 'Personal'}</span>
                            <span>•</span>
                            <span>
                              Updated{' '}
                              {new Date(idea.updated_at).toLocaleDateString()}
                            </span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/dashboard/ideas/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Idea
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/dashboard/workspaces/new">
                        <Building2 className="mr-2 h-4 w-4" />
                        New Workspace
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/dashboard/analyzer">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        Analyze
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Development Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Ideas Created</span>
                        <span className="font-medium">
                          {
                            ideas.filter(
                              (i) =>
                                new Date(i.created_at) >
                                new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                            ).length
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Ready to Build</span>
                        <span className="font-medium">{stats[3].count}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
