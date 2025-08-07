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
  Calendar,
  Download,
  Eye,
  Layout,
  Lightbulb,
  Plus,
  Search,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

const ideaTemplates = [
  {
    id: 'startup-pitch',
    name: 'Startup Pitch Deck',
    description:
      'Complete template for presenting your startup idea to investors',
    category: 'Business',
    icon: Target,
    color: 'bg-blue-500',
    sections: [
      'Problem Statement',
      'Solution',
      'Market Size',
      'Business Model',
      'Team',
      'Financials',
    ],
  },
  {
    id: 'product-roadmap',
    name: 'Product Roadmap',
    description: 'Strategic planning template for product development',
    category: 'Product',
    icon: Calendar,
    color: 'bg-green-500',
    sections: ['Vision', 'Goals', 'Timeline', 'Milestones', 'Resources'],
  },
  {
    id: 'team-collaboration',
    name: 'Team Collaboration Framework',
    description: 'Template for organizing team projects and workflows',
    category: 'Team',
    icon: Users,
    color: 'bg-purple-500',
    sections: [
      'Roles',
      'Responsibilities',
      'Communication',
      'Timeline',
      'Deliverables',
    ],
  },
  {
    id: 'innovation-challenge',
    name: 'Innovation Challenge',
    description: 'Framework for running internal innovation programs',
    category: 'Innovation',
    icon: Lightbulb,
    color: 'bg-orange-500',
    sections: [
      'Challenge Statement',
      'Criteria',
      'Timeline',
      'Rewards',
      'Evaluation',
    ],
  },
  {
    id: 'technical-spec',
    name: 'Technical Specification',
    description:
      'Detailed technical planning template for development projects',
    category: 'Technical',
    icon: Zap,
    color: 'bg-indigo-500',
    sections: ['Architecture', 'Requirements', 'APIs', 'Database', 'Security'],
  },
  {
    id: 'market-analysis',
    name: 'Market Analysis',
    description:
      'Comprehensive market research and competitive analysis template',
    category: 'Research',
    icon: Target,
    color: 'bg-red-500',
    sections: [
      'Market Size',
      'Competitors',
      'Trends',
      'Opportunities',
      'Risks',
    ],
  },
];

export default function TemplatesPage() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Idea Templates</h1>
          <p className="text-sm text-muted-foreground">
            Pre-built frameworks to accelerate your idea development
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="w-full space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search templates..." className="pl-10" />
                </div>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Import Template
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Template Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ideaTemplates.map((template) => (
              <Card
                key={template.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg p-3 ${template.color} text-white`}
                    >
                      <template.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {template.name}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{template.category}</Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="mr-1 h-3 w-3" />
                          Preview
                        </Button>
                        <Button size="sm" asChild>
                          <Link
                            href={`/dashboard/ideas/new?template=${template.id}`}
                          >
                            Use Template
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-medium text-muted-foreground">
                        Sections:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {template.sections.slice(0, 3).map((section) => (
                          <Badge
                            key={section}
                            variant="outline"
                            className="text-xs"
                          >
                            {section}
                          </Badge>
                        ))}
                        {template.sections.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{template.sections.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common template operations and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Create New</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link href="/dashboard/ideas/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Idea from Template
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Layout className="mr-2 h-4 w-4" />
                      Create Custom Template
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Manage</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Download className="mr-2 h-4 w-4" />
                      Export Templates
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="mr-2 h-4 w-4" />
                      Template Gallery
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
