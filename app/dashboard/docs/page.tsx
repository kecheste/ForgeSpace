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
import {
  BarChart3,
  BookOpen,
  Calendar,
  Edit,
  FileText,
  Globe,
  Lightbulb,
  MessageCircle,
  Palette,
  Plus,
  Search,
  Users,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';

const documentationSections = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Quick start guide and platform overview',
    icon: BookOpen,
    color: 'bg-blue-500',
    articles: [
      {
        title: 'Welcome to ForgeSpace',
        status: 'published',
        readTime: '5 min',
      },
      {
        title: 'Creating Your First Idea',
        status: 'published',
        readTime: '8 min',
      },
      {
        title: 'Understanding Workspaces',
        status: 'published',
        readTime: '6 min',
      },
      { title: 'Platform Navigation', status: 'published', readTime: '4 min' },
    ],
  },
  {
    id: 'ideas',
    title: 'Idea Management',
    description: 'How to create, organize, and develop ideas',
    icon: Lightbulb,
    color: 'bg-yellow-500',
    articles: [
      {
        title: 'Creating and Editing Ideas',
        status: 'published',
        readTime: '10 min',
      },
      {
        title: 'Idea Lifecycle Phases',
        status: 'published',
        readTime: '12 min',
      },
      {
        title: 'Collaborating on Ideas',
        status: 'published',
        readTime: '8 min',
      },
      { title: 'Using Templates', status: 'published', readTime: '6 min' },
    ],
  },
  {
    id: 'workspaces',
    title: 'Workspaces',
    description: 'Team collaboration and workspace management',
    icon: Users,
    color: 'bg-green-500',
    articles: [
      { title: 'Creating Workspaces', status: 'published', readTime: '7 min' },
      {
        title: 'Managing Team Members',
        status: 'published',
        readTime: '9 min',
      },
      {
        title: 'Workspace Permissions',
        status: 'published',
        readTime: '8 min',
      },
      {
        title: 'Inviting Collaborators',
        status: 'published',
        readTime: '5 min',
      },
    ],
  },
  {
    id: 'whiteboard',
    title: 'Whiteboard & Visualization',
    description: 'Visual planning and brainstorming tools',
    icon: Palette,
    color: 'bg-purple-500',
    articles: [
      { title: 'Creating Whiteboards', status: 'published', readTime: '6 min' },
      {
        title: 'Collaborative Drawing',
        status: 'published',
        readTime: '8 min',
      },
      { title: 'Templates and Shapes', status: 'published', readTime: '7 min' },
      {
        title: 'Exporting and Sharing',
        status: 'published',
        readTime: '5 min',
      },
    ],
  },
  {
    id: 'ai-analyzer',
    title: 'AI Analysis',
    description: 'AI-powered idea analysis and insights',
    icon: BarChart3,
    color: 'bg-indigo-500',
    articles: [
      {
        title: 'Using the AI Analyzer',
        status: 'published',
        readTime: '10 min',
      },
      {
        title: 'Understanding Analysis Results',
        status: 'published',
        readTime: '12 min',
      },
      {
        title: 'Market Research Features',
        status: 'published',
        readTime: '9 min',
      },
      { title: 'Competitive Analysis', status: 'published', readTime: '8 min' },
    ],
  },
  {
    id: 'tools',
    title: 'Essential Tools',
    description: 'Core tools for idea development',
    icon: Wrench,
    color: 'bg-orange-500',
    articles: [
      { title: 'Code Snippets', status: 'published', readTime: '6 min' },
      { title: 'Documentation Editor', status: 'published', readTime: '8 min' },
      { title: 'Template Library', status: 'published', readTime: '7 min' },
      { title: 'Integration Tools', status: 'draft', readTime: '10 min' },
    ],
  },
];

export default function DocumentationPage() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Documentation</h1>
          <p className="text-sm text-muted-foreground">
            Comprehensive guides and tutorials
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Article
        </Button>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="w-full space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search documentation..."
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Start */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Quick Start Guide
              </CardTitle>
              <CardDescription>
                Get up and running with ForgeSpace in minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/dashboard/ideas/new">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Create Your First Idea
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/dashboard/workspaces/new">
                    <Users className="mr-2 h-4 w-4" />
                    Create a Workspace
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/dashboard/whiteboard">
                    <Palette className="mr-2 h-4 w-4" />
                    Try the Whiteboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Documentation Sections */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {documentationSections.map((section) => (
              <Card
                key={section.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg p-3 ${section.color} text-white`}
                    >
                      <section.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {section.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {section.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      {section.articles.map((article, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {article.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {article.readTime}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                article.status === 'published'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {article.status}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" className="w-full" size="sm">
                      View All Articles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Additional Resources
              </CardTitle>
              <CardDescription>
                External resources and community support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/dashboard/help">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Help Center
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Video Tutorials
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Community Forum
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  API Reference
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
