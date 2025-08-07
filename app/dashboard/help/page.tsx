'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowRight,
  BarChart3,
  Book,
  FileText,
  Lightbulb,
  MessageCircle,
  Play,
  Search,
  Users,
} from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    question: 'How do I create my first idea?',
    answer:
      "Click the 'New Idea' button from the dashboard or ideas page. Fill in the title, description, and select a workspace.",
  },
  {
    question: 'What are the different idea phases?',
    answer:
      'ForgeSpace uses 4 phases: Inception, Refinement, Planning, and Execution Ready.',
  },
  {
    question: 'How do I invite team members?',
    answer:
      "Go to your workspace, click Members, and use the 'Invite Member' button.",
  },
  {
    question: "What's the difference between personal and team workspaces?",
    answer:
      'Personal workspaces are private. Team workspaces allow collaboration with permissions.',
  },
  {
    question: 'How does the Idea Analyzer work?',
    answer:
      'The AI evaluates creativity potential, technical feasibility, and development risks to provide a viability score.',
  },
];

const tutorials = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of creating ideas',
    duration: '5 min',
    category: 'Basics',
  },
  {
    title: 'Workspace Setup',
    description: 'Set up team workspaces and permissions',
    duration: '8 min',
    category: 'Collaboration',
  },
  {
    title: 'Idea Analyzer',
    description: 'Analyze ideas with AI-powered insights',
    duration: '6 min',
    category: 'Analysis',
  },
];

const resources = [
  {
    title: 'Platform Documentation',
    description: 'Guide to all features',
    icon: Book,
  },
  {
    title: 'API Reference',
    description: 'Technical docs for developers',
    icon: FileText,
  },
  {
    title: 'Community Forum',
    description: 'Connect with other users',
    icon: MessageCircle,
  },
];

export default function HelpPage() {
  return (
    <div className="flex h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-6 backdrop-blur">
        <div className="flex-1">
          <h1 className="text-lg font-medium">Help Center</h1>
        </div>
        <Button asChild size="sm">
          <Link href="/help/contact">
            <MessageCircle className="mr-2 h-4 w-4" />
            Contact
          </Link>
        </Button>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search help articles..."
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div>
            <h2 className="mb-4 text-lg font-medium">Quick Links</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:border-primary transition-colors">
                <Link href="/ideas/new">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Lightbulb className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Create Idea</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Start a new idea
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>

              <Card className="hover:border-primary transition-colors">
                <Link href="/workspaces/new">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          Create Workspace
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Set up team collaboration
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>

              <Card className="hover:border-primary transition-colors">
                <Link href="/analyzer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          Analyze Idea
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Get AI-powered insights
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="tutorials">
            <TabsList className="w-full">
              <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <div className="pt-4">
              <TabsContent value="tutorials" className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {tutorials.map((tutorial) => (
                    <Card
                      key={tutorial.title}
                      className="hover:border-primary transition-colors"
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">
                            {tutorial.title}
                          </CardTitle>
                          <Badge variant="outline">{tutorial.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {tutorial.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Play className="h-4 w-4" />
                            {tutorial.duration}
                          </div>
                          <Button variant="ghost" size="sm" className="group">
                            Watch{' '}
                            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="faq" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <Accordion type="single" collapsible className="w-full">
                      {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-sm text-muted-foreground">
                              {faq.answer}
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {resources.map((resource) => (
                    <Card
                      key={resource.title}
                      className="hover:border-primary transition-colors"
                    >
                      <Link href="#">
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-gray-500/10 flex items-center justify-center">
                              <resource.icon className="h-5 w-5 text-gray-500" />
                            </div>
                            <div>
                              <CardTitle className="text-base">
                                {resource.title}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {resource.description}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                      </Link>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Contact Section */}
          <Card>
            <CardHeader>
              <CardTitle>Need More Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Can't find what you're looking for? Our support team is here
                    to help.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      <span>support@forgespace.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Book className="h-4 w-4" />
                      <span>Documentation</span>
                    </div>
                  </div>
                </div>
                <Button asChild>
                  <Link href="/help/contact">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
