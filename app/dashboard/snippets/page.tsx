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
  Code,
  Copy,
  Database,
  Edit,
  FileText,
  Globe,
  Palette,
  Plus,
  Search,
  Smartphone,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

const codeSnippets = [
  {
    id: 'react-component',
    title: 'React Component Template',
    description: 'Basic React functional component with TypeScript',
    language: 'typescript',
    category: 'Frontend',
    icon: Globe,
    color: 'bg-blue-500',
    code: `import React from 'react';

interface Props {
  title: string;
  children: React.ReactNode;
}

export const Component: React.FC<Props> = ({ title, children }) => {
  return (
    <div className="component">
      <h2>{title}</h2>
      {children}
    </div>
  );
};`,
  },
  {
    id: 'api-endpoint',
    title: 'API Endpoint Handler',
    description: 'Next.js API route with error handling',
    language: 'typescript',
    category: 'Backend',
    icon: Zap,
    color: 'bg-green-500',
    code: `import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method } = req;
    
    switch (method) {
      case 'GET':
        return res.status(200).json({ message: 'Success' });
      case 'POST':
        return res.status(201).json({ message: 'Created' });
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(\`Method \${method} Not Allowed\`);
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}`,
  },
  {
    id: 'database-query',
    title: 'Database Query Helper',
    description: 'Supabase query with proper error handling',
    language: 'typescript',
    category: 'Database',
    icon: Database,
    color: 'bg-purple-500',
    code: `import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

export async function getUserData(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}`,
  },
  {
    id: 'css-utility',
    title: 'CSS Utility Classes',
    description: 'Common Tailwind CSS utility patterns',
    language: 'css',
    category: 'Styling',
    icon: Palette,
    color: 'bg-orange-500',
    code: `/* Responsive container */
.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* Card component */
.card {
  @apply bg-white rounded-lg shadow-md p-6 border border-gray-200;
}

/* Button variants */
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors;
}`,
  },
  {
    id: 'mobile-responsive',
    title: 'Mobile Responsive Hook',
    description: 'React hook for mobile device detection',
    language: 'typescript',
    category: 'Frontend',
    icon: Smartphone,
    color: 'bg-indigo-500',
    code: `import { useState, useEffect } from 'react';

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}`,
  },
  {
    id: 'form-validation',
    title: 'Form Validation Schema',
    description: 'Zod schema for form validation',
    language: 'typescript',
    category: 'Validation',
    icon: FileText,
    color: 'bg-red-500',
    code: `import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18 years old'),
  website: z.string().url().optional(),
});

export type UserFormData = z.infer<typeof userSchema>;`,
  },
];

type Snippet = {
  id: string;
  title: string;
  description: string;
  language: string;
  category: string;
  icon: React.ElementType;
  color: string;
  code: string;
};

export default function SnippetsPage() {
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSnippets = codeSnippets.filter(
    (snippet) =>
      snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      snippet.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Code Snippets</h1>
          <p className="text-sm text-muted-foreground">
            Reusable code examples and templates
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Snippet
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
                  placeholder="Search snippets..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Snippets Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSnippets.map((snippet) => (
              <Card
                key={snippet.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-lg p-3 ${snippet.color} text-white`}
                    >
                      <snippet.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {snippet.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {snippet.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{snippet.category}</Badge>
                      <Badge variant="outline">{snippet.language}</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(snippet.code)}
                      >
                        <Copy className="mr-1 h-3 w-3" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedSnippet(snippet)}
                      >
                        <Edit className="mr-1 h-3 w-3" />
                        View
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common snippet operations and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Create New</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Snippet
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="mr-2 h-4 w-4" />
                      Import Snippets
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Manage</h4>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <Copy className="mr-2 h-4 w-4" />
                      Export All
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Categories
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Snippet Viewer Dialog */}
      {selectedSnippet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedSnippet.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedSnippet.description}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(selectedSnippet.code)}
                >
                  <Copy className="mr-1 h-3 w-3" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSnippet(null)}
                >
                  Close
                </Button>
              </div>
            </div>
            <div className="p-4 overflow-auto max-h-[60vh]">
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{selectedSnippet.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
