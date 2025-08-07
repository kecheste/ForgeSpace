'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowRight,
  Brain,
  Code,
  FileText,
  Layout,
  Palette,
  PenTool,
  Wrench,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

const essentialTools = [
  {
    name: 'Whiteboard',
    description: 'Visual brainstorming and planning',
    status: 'Available',
    icon: PenTool,
    href: '/dashboard/whiteboard',
    color: 'text-indigo-500 bg-indigo-500/10',
  },
  {
    name: 'AI Analyzer',
    description: 'Viability and feasibility assessment',
    icon: Brain,
    href: '/dashboard/analyzer',
    color: 'text-green-500 bg-green-500/10',
  },
  {
    name: 'Templates',
    description: 'Pre-built idea frameworks',
    icon: Layout,
    href: '/dashboard/templates',
    color: 'text-blue-500 bg-blue-500/10',
  },
  {
    name: 'Code Snippets',
    description: 'Store and share code examples',
    icon: Code,
    href: '/dashboard/snippets',
    color: 'text-purple-500 bg-purple-500/10',
  },
  {
    name: 'Documentation',
    description: 'Rich text with markdown',
    icon: FileText,
    href: '/dashboard/docs',
    color: 'text-orange-500 bg-orange-500/10',
  },
  {
    name: 'Integrations',
    description: 'Connect external tools',
    status: 'Soon',
    icon: Zap,
    href: '/dashboard/integrations',
    color: 'text-gray-500 bg-gray-500/10',
  },
];

export default function EssentialTools() {
  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur">
        <div className="flex-1">
          <h1 className="text-lg font-medium">Tools</h1>
        </div>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="w-full space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {essentialTools.map((tool) => (
              <Card
                key={tool.name}
                className="hover:border-primary transition-colors"
              >
                <Link href={tool.href}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg p-2 ${tool.color}`}>
                        <tool.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{tool.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      {tool.status && (
                        <Badge
                          variant={
                            tool.status === 'Available' ? 'default' : 'outline'
                          }
                        >
                          {tool.status}
                        </Badge>
                      )}
                      <div className="flex items-center text-sm font-medium text-primary">
                        Open <ArrowRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Wrench className="h-4 w-4" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/ideas/new">
                  <PenTool className="mr-2 h-4 w-4" />
                  New Idea
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/whiteboard">
                  <Palette className="mr-2 h-4 w-4" />
                  Whiteboard
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/analyzer">
                  <Brain className="mr-2 h-4 w-4" />
                  AI Analysis
                </Link>
              </Button>
              <Button variant="outline" className="justify-start" asChild>
                <Link href="/dashboard/ideas">
                  <FileText className="mr-2 h-4 w-4" />
                  View Ideas
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
