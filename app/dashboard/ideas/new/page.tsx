'use client';

import type React from 'react';

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
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ideasAPI } from '@/lib/api/ideas';
import { usersAPI } from '@/lib/api/users';
import { workspacesAPI } from '@/lib/api/workspaces';
import { useUser } from '@clerk/nextjs';
import { ArrowLeft, Plus, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const suggestedTags = [
  'AI',
  'Technology',
  'Business',
  'Health',
  'Environment',
  'Education',
  'Finance',
  'Entertainment',
];

export default function NewIdeaPage() {
  const { user } = useUser();
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState('');
  const [workspaces, setWorkspaces] = useState<
    { id: string; name: string; [key: string]: unknown }[]
  >([]);
  type UserProfile = { id: string; [key: string]: unknown };
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    workspace_id: '',
    initial_content: '',
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      // Get user profile
      const profile = await usersAPI.createOrUpdateProfile({
        clerk_user_id: user!.id,
        email: user!.emailAddresses[0]?.emailAddress || '',
        first_name: user!.firstName,
        last_name: user!.lastName,
        image_url: user!.imageUrl,
      });
      setUserProfile(profile);

      // Load workspaces
      const workspacesData = await workspacesAPI.getWorkspaces(user!.id);
      setWorkspaces(workspacesData || []);

      // Set default workspace
      if (
        workspacesData &&
        Array.isArray(workspacesData) &&
        workspacesData.length > 0
      ) {
        setFormData((prev) => ({
          ...prev,
          workspace_id: workspacesData[0].id,
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter((t) => t !== tag));
  };

  const addCustomTag = () => {
    if (customTag.trim()) {
      addTag(customTag.trim());
      setCustomTag('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile || loading) return;

    setLoading(true);
    try {
      const idea = await ideasAPI.createIdea({
        title: formData.title,
        description: formData.description,
        workspace_id: formData.workspace_id,
        creator_id: userProfile.id,
        tags: selectedTags,
        phase: 'inception',
      });

      if (formData.initial_content) {
        await ideasAPI.updatePhase(
          idea.id,
          'inception',
          formData.initial_content,
          true
        );
      }

      router.push(`/dashboard/ideas/${idea.id}`);
    } catch (error) {
      console.error('Error creating idea:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/ideas">
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Create New Idea</h1>
          <p className="text-sm text-muted-foreground">
            Start your journey from concept to execution
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>
                    Provide the essential details about your idea
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Idea Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter a compelling title for your idea..."
                      value={formData.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your idea in detail. What problem does it solve? What makes it unique?"
                      className="min-h-[120px]"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workspace">Workspace</Label>
                    <Select
                      value={formData.workspace_id}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          workspace_id: value,
                        }))
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a workspace" />
                      </SelectTrigger>
                      <SelectContent>
                        {workspaces.map(
                          (workspace: { id: string; name: string }) => (
                            <SelectItem key={workspace.id} value={workspace.id}>
                              {workspace.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tags & Categories</CardTitle>
                  <CardDescription>
                    Add tags to help organize and discover your idea
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Selected Tags</Label>
                    <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                      {selectedTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {selectedTags.length === 0 && (
                        <span className="text-muted-foreground text-sm">
                          No tags selected
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Suggested Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {suggestedTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => addTag(tag)}
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Custom Tag</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter custom tag..."
                        value={customTag}
                        onChange={(e) => setCustomTag(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' &&
                          (e.preventDefault(), addCustomTag())
                        }
                      />
                      <Button
                        type="button"
                        onClick={addCustomTag}
                        variant="outline"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Initial Thoughts</CardTitle>
                  <CardDescription>
                    Capture your initial thoughts and ideas for the Inception
                    phase
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="What inspired this idea? What are the key problems it addresses? Any initial thoughts on implementation?"
                    className="min-h-[150px]"
                    value={formData.initial_content}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        initial_content: e.target.value,
                      }))
                    }
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    AI Assistant
                  </CardTitle>
                  <CardDescription>
                    Get AI-powered suggestions to improve your idea
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    type="button"
                    className="w-full bg-transparent"
                    variant="outline"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Idea
                  </Button>
                  <Button
                    type="button"
                    className="w-full bg-transparent"
                    variant="outline"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Suggest Improvements
                  </Button>
                  <Button
                    type="button"
                    className="w-full bg-transparent"
                    variant="outline"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Market Research
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Development Phases</CardTitle>
                  <CardDescription>
                    Your idea will progress through these phases
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <div>
                      <div className="font-medium text-sm">Inception</div>
                      <div className="text-xs text-muted-foreground">
                        Initial concept and problem definition
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-gray-300" />
                    <div>
                      <div className="font-medium text-sm">Refinement</div>
                      <div className="text-xs text-muted-foreground">
                        Detailed analysis and solution refinement
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-gray-300" />
                    <div>
                      <div className="font-medium text-sm">Planning</div>
                      <div className="text-xs text-muted-foreground">
                        Project planning and resource allocation
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-gray-300" />
                    <div>
                      <div className="font-medium text-sm">Execution Ready</div>
                      <div className="text-xs text-muted-foreground">
                        Ready for implementation
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Idea'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  Save as Draft
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
