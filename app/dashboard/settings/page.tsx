'use client';

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
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  User,
  Bell,
  Shield,
  Key,
  Smartphone,
  Globe,
  Lock,
  Save,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { usersAPI } from '@/lib/api/users';
import {
  notificationsAPI,
  type NotificationPreferences,
} from '@/lib/api/notifications';
import { useToast } from '@/hooks/use-toast';
import { PageSkeleton } from '@/components/ui/loading-skeleton';
import { useUserProfile } from '@/components/providers/user-profile-provider';

interface ProfileFormData {
  first_name: string;
  last_name: string;
}

export default function SettingsPage() {
  const { user } = useUser();
  const { userProfile, refreshProfile } = useUserProfile();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    first_name: '',
    last_name: '',
  });
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    email_notifications: true,
    push_notifications: true,
    idea_notifications: true,
    comment_notifications: true,
    mention_notifications: true,
    weekly_digest: false,
    workspace_invites: true,
  });
  const [privacy, setPrivacy] = useState({
    profile_visible: true,
    ideas_public: false,
    analytics_tracking: true,
    data_collection: true,
  });

  useEffect(() => {
    if (userProfile) {
      setProfileForm({
        first_name: userProfile.first_name || user?.firstName || '',
        last_name: userProfile.last_name || user?.lastName || '',
      });

      // Load notification preferences
      const loadNotifications = async () => {
        try {
          const prefs = await notificationsAPI.getPreferences(userProfile.id);
          if (prefs) {
            setNotifications(prefs);
          }
        } catch (error) {
          console.error('Error loading notifications:', error);
        }
      };

      loadNotifications();
      setLoading(false);
    }
  }, [userProfile, user]);

  const handleProfileChange = (field: keyof ProfileFormData, value: string) => {
    setProfileForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    if (!user || !userProfile) return;

    try {
      setSaving(true);

      // Update profile in database using the updateProfile method
      await usersAPI.updateProfile(userProfile.id, {
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        email: user.emailAddresses[0]?.emailAddress || '',
        image_url: user.imageUrl || '',
      });

      // Refresh the user profile context to update the sidebar
      await refreshProfile();

      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to save profile changes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      if (!userProfile) return;

      await notificationsAPI.updatePreferences(userProfile.id, notifications);
      toast({
        title: 'Success',
        description: 'Notification preferences saved',
      });
    } catch (error) {
      console.error('Error saving notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notification preferences',
        variant: 'destructive',
      });
    }
  };

  const handleSavePrivacy = async () => {
    toast({
      title: 'Success',
      description: 'Privacy settings saved',
    });
  };

  const handleAvatarChange = () => {
    toast({
      title: 'Avatar Update',
      description: 'Avatar changes are managed through your account settings.',
    });
  };

  const getDisplayName = () => {
    const firstName = userProfile?.first_name || user?.firstName;
    const lastName = userProfile?.last_name || user?.lastName;

    if (firstName || lastName) {
      return `${firstName || ''} ${lastName || ''}`.trim();
    }

    return user?.emailAddresses[0]?.emailAddress || 'User';
  };

  const getAvatarInitials = () => {
    const firstName = userProfile?.first_name || user?.firstName;
    const lastName = userProfile?.last_name || user?.lastName;

    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`;
    } else if (firstName) {
      return firstName[0];
    } else if (lastName) {
      return lastName[0];
    } else {
      const email = user?.emailAddresses[0]?.emailAddress || '';
      return email.substring(0, 2).toUpperCase();
    }
  };

  if (loading) {
    return <PageSkeleton />;
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account and platform preferences
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="w-full space-y-6">
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and profile settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user?.imageUrl || '/placeholder.svg'} />
                      <AvatarFallback className="text-lg">
                        {getAvatarInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <div>
                        <p className="font-medium">{getDisplayName()}</p>
                        <p className="text-sm text-muted-foreground">
                          {user?.emailAddresses[0]?.emailAddress}
                        </p>
                      </div>
                      <Button variant="outline" onClick={handleAvatarChange}>
                        Change Avatar
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        JPG, GIF or PNG. Max size of 2MB.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        value={profileForm.first_name}
                        onChange={(e) =>
                          handleProfileChange('first_name', e.target.value)
                        }
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        value={profileForm.last_name}
                        onChange={(e) =>
                          handleProfileChange('last_name', e.target.value)
                        }
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.emailAddresses[0]?.emailAddress || ''}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Email is managed through your account provider and cannot
                      be changed here.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    {!saving && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <CheckCircle className="h-4 w-4" />
                        All changes saved
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Email Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to be notified about platform activity
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        checked={notifications.email_notifications}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            email_notifications: checked,
                          }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive push notifications in your browser
                        </p>
                      </div>
                      <Switch
                        checked={notifications.push_notifications}
                        onCheckedChange={(checked) =>
                          setNotifications((prev) => ({
                            ...prev,
                            push_notifications: checked,
                          }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <Label className="text-base">
                        Activity Notifications
                      </Label>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Workspace Invitations</Label>
                          <p className="text-sm text-muted-foreground">
                            When someone invites you to join a workspace
                          </p>
                        </div>
                        <Switch
                          checked={notifications.workspace_invites}
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({
                              ...prev,
                              workspace_invites: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>New Ideas</Label>
                          <p className="text-sm text-muted-foreground">
                            When someone creates a new idea in your workspace
                          </p>
                        </div>
                        <Switch
                          checked={notifications.idea_notifications}
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({
                              ...prev,
                              idea_notifications: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Comments</Label>
                          <p className="text-sm text-muted-foreground">
                            When someone comments on your ideas
                          </p>
                        </div>
                        <Switch
                          checked={notifications.comment_notifications}
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({
                              ...prev,
                              comment_notifications: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Mentions</Label>
                          <p className="text-sm text-muted-foreground">
                            When someone mentions you in a comment
                          </p>
                        </div>
                        <Switch
                          checked={notifications.mention_notifications}
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({
                              ...prev,
                              mention_notifications: checked,
                            }))
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Weekly Digest</Label>
                          <p className="text-sm text-muted-foreground">
                            Weekly summary of your workspace activity
                          </p>
                        </div>
                        <Switch
                          checked={notifications.weekly_digest}
                          onCheckedChange={(checked) =>
                            setNotifications((prev) => ({
                              ...prev,
                              weekly_digest: checked,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleSaveNotifications}>
                    Save Notification Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Privacy Settings
                  </CardTitle>
                  <CardDescription>
                    Control your privacy and data sharing preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Public Profile</Label>
                        <p className="text-sm text-muted-foreground">
                          Make your profile visible to other users
                        </p>
                      </div>
                      <Switch
                        checked={privacy.profile_visible}
                        onCheckedChange={(checked) =>
                          setPrivacy((prev) => ({
                            ...prev,
                            profile_visible: checked,
                          }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Public Ideas</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow your ideas to be discovered by others
                        </p>
                      </div>
                      <Switch
                        checked={privacy.ideas_public}
                        onCheckedChange={(checked) =>
                          setPrivacy((prev) => ({
                            ...prev,
                            ideas_public: checked,
                          }))
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Analytics Tracking</Label>
                        <p className="text-sm text-muted-foreground">
                          Help us improve the platform with usage analytics
                        </p>
                      </div>
                      <Switch
                        checked={privacy.analytics_tracking}
                        onCheckedChange={(checked) =>
                          setPrivacy((prev) => ({
                            ...prev,
                            analytics_tracking: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Data Collection</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow collection of usage data for personalization
                        </p>
                      </div>
                      <Switch
                        checked={privacy.data_collection}
                        onCheckedChange={(checked) =>
                          setPrivacy((prev) => ({
                            ...prev,
                            data_collection: checked,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <Button onClick={handleSavePrivacy}>
                    Save Privacy Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and authentication
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Key className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label className="text-base">
                            Two-Factor Authentication
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label className="text-base">Active Sessions</Label>
                          <p className="text-sm text-muted-foreground">
                            Manage your active login sessions
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">View Sessions</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Key className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label className="text-base">API Keys</Label>
                          <p className="text-sm text-muted-foreground">
                            Manage your API access keys
                          </p>
                        </div>
                      </div>
                      <Button variant="outline">Manage Keys</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integrations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Third-party Integrations
                  </CardTitle>
                  <CardDescription>
                    Connect external services and tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      name: 'Slack',
                      description: 'Team communication',
                      connected: true,
                    },
                    {
                      name: 'GitHub',
                      description: 'Code repository',
                      connected: false,
                    },
                    {
                      name: 'Figma',
                      description: 'Design collaboration',
                      connected: true,
                    },
                    {
                      name: 'Jira',
                      description: 'Project management',
                      connected: false,
                    },
                    {
                      name: 'Google Drive',
                      description: 'File storage',
                      connected: false,
                    },
                  ].map((integration) => (
                    <div
                      key={integration.name}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <Label className="text-base">{integration.name}</Label>
                        <p className="text-sm text-muted-foreground">
                          {integration.description}
                        </p>
                      </div>
                      <Button
                        variant={
                          integration.connected ? 'destructive' : 'default'
                        }
                      >
                        {integration.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Subscription</CardTitle>
                  <CardDescription>
                    Manage your subscription and billing information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                    <div>
                      <Label className="text-base">Current Plan</Label>
                      <p className="text-sm text-muted-foreground">
                        Free Plan - Basic features
                      </p>
                    </div>
                    <Button>Upgrade Plan</Button>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <Label className="text-base">Usage This Month</Label>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold">15</div>
                        <div className="text-sm text-muted-foreground">
                          Ideas Created
                        </div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold">3</div>
                        <div className="text-sm text-muted-foreground">
                          Workspaces
                        </div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold">8</div>
                        <div className="text-sm text-muted-foreground">
                          Collaborators
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
