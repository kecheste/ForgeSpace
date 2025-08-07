'use client';

import type React from 'react';

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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Building2, Users, Lock } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { workspacesAPI } from '@/lib/api/workspaces';
import { usersAPI } from '@/lib/api/users';

export default function NewWorkspacePage() {
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'personal' as 'personal' | 'team',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || loading) return;

    setLoading(true);
    try {
      // Create or update user profile first
      const profile = await usersAPI.createOrUpdateProfile({
        clerk_user_id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        first_name: user.firstName || '',
        last_name: user.lastName || '',
        image_url: user.imageUrl || '',
      });

      // Create workspace
      const workspace = await workspacesAPI.createWorkspace(
        {
          name: formData.name,
          description: formData.description,
          type: formData.type,
          owner_id: profile.id,
        },
        profile.id
      );

      router.push(`/dashboard/workspaces/${workspace.id}`);
    } catch (error) {
      console.error('Error creating workspace:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/workspaces">
            <ArrowLeft className="mr-2 h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Create New Workspace</h1>
          <p className="text-sm text-muted-foreground">
            Set up a collaborative space for your team
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Workspace Details</CardTitle>
              <CardDescription>
                Provide basic information about your workspace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  placeholder="Enter workspace name..."
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose of this workspace..."
                  className="min-h-[100px]"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Workspace Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'personal' | 'team') =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select workspace type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Personal</div>
                          <div className="text-xs text-muted-foreground">
                            Private workspace for your ideas
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="team">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <div>
                          <div className="font-medium">Team</div>
                          <div className="text-xs text-muted-foreground">
                            Collaborative workspace for teams
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Workspace Features</CardTitle>
              <CardDescription>
                What you'll get with your new workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Building2 className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">Organized Ideas</div>
                    <div className="text-sm text-muted-foreground">
                      Keep all related ideas in one place
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-green-100 p-2">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">Team Collaboration</div>
                    <div className="text-sm text-muted-foreground">
                      Invite members and collaborate in real-time
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-purple-100 p-2">
                    <Lock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">Access Control</div>
                    <div className="text-sm text-muted-foreground">
                      Manage who can view and edit ideas
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-orange-100 p-2">
                    <Building2 className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">Project Management</div>
                    <div className="text-sm text-muted-foreground">
                      Track progress from idea to execution
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? 'Creating...' : 'Create Workspace'}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/workspaces">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
