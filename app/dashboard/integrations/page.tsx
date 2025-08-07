'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Zap,
  Plus,
  Settings,
  Globe,
  MessageCircle,
  GitBranch,
  Palette,
  Database,
  Calendar,
  Mail,
  Shield,
  CheckCircle,
} from 'lucide-react';

const availableIntegrations = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Connect repositories and sync issues',
    icon: GitBranch,
    color: 'bg-gray-800',
    status: 'available',
    category: 'Development',
    features: ['Repository linking', 'Issue sync', 'Code snippets'],
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team notifications and updates',
    icon: MessageCircle,
    color: 'bg-purple-600',
    status: 'available',
    category: 'Communication',
    features: ['Notifications', 'Channel updates', 'Team alerts'],
  },
  {
    id: 'figma',
    name: 'Figma',
    description: 'Design collaboration and asset management',
    icon: Palette,
    color: 'bg-pink-500',
    status: 'coming-soon',
    category: 'Design',
    features: ['Design embedding', 'Asset sync', 'Collaboration'],
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Documentation and knowledge base sync',
    icon: Database,
    color: 'bg-black',
    status: 'coming-soon',
    category: 'Documentation',
    features: ['Page embedding', 'Content sync', 'Knowledge base'],
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Schedule management and meeting integration',
    icon: Calendar,
    color: 'bg-blue-500',
    status: 'coming-soon',
    category: 'Productivity',
    features: ['Event sync', 'Meeting scheduling', 'Timeline integration'],
  },
  {
    id: 'email',
    name: 'Email Integration',
    description: 'Email notifications and updates',
    icon: Mail,
    color: 'bg-green-500',
    status: 'available',
    category: 'Communication',
    features: ['Email notifications', 'Digest reports', 'Team updates'],
  },
];

const connectedIntegrations = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'Connected to 3 repositories',
    icon: GitBranch,
    color: 'bg-gray-800',
    status: 'connected',
    lastSync: '2 hours ago',
    syncStatus: 'success',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Connected to #general channel',
    icon: MessageCircle,
    color: 'bg-purple-600',
    status: 'connected',
    lastSync: '5 minutes ago',
    syncStatus: 'success',
  },
];

export default function IntegrationsPage() {
  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center gap-4 border-b px-6">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">Integrations</h1>
          <p className="text-sm text-muted-foreground">
            Connect external tools and services
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Integration
        </Button>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="w-full space-y-6">
          {connectedIntegrations.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <h2 className="text-lg font-semibold">
                  Connected Integrations
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {connectedIntegrations.map((integration) => (
                  <Card
                    key={integration.id}
                    className="border-green-200 bg-green-50/50"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`rounded-lg p-3 ${integration.color} text-white`}
                          >
                            <integration.icon className="h-6 w-6" />
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              {integration.name}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {integration.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="default" className="bg-green-600">
                          Connected
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Last sync:
                          </span>
                          <span className="font-medium">
                            {integration.lastSync}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Status:</span>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-green-600">Synced</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Settings className="mr-1 h-3 w-3" />
                            Configure
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Zap className="mr-1 h-3 w-3" />
                            Sync Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-600" />
              <h2 className="text-lg font-semibold">Available Integrations</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableIntegrations.map((integration) => (
                <Card
                  key={integration.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-lg p-3 ${integration.color} text-white`}
                        >
                          <integration.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {integration.name}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {integration.description}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant={
                          integration.status === 'available'
                            ? 'default'
                            : 'secondary'
                        }
                        className={
                          integration.status === 'coming-soon'
                            ? 'bg-orange-100 text-orange-800'
                            : ''
                        }
                      >
                        {integration.status === 'available'
                          ? 'Available'
                          : 'Coming Soon'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-muted-foreground">
                          Features:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {integration.features.slice(0, 2).map((feature) => (
                            <Badge
                              key={feature}
                              variant="outline"
                              className="text-xs"
                            >
                              {feature}
                            </Badge>
                          ))}
                          {integration.features.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{integration.features.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button
                        className="w-full"
                        disabled={integration.status === 'coming-soon'}
                      >
                        {integration.status === 'available'
                          ? 'Connect'
                          : 'Notify When Ready'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Integration Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Integration Settings
              </CardTitle>
              <CardDescription>
                Configure how integrations work with your workspace
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto-sync integrations</div>
                    <div className="text-sm text-muted-foreground">
                      Automatically sync data from connected integrations
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Sync notifications</div>
                    <div className="text-sm text-muted-foreground">
                      Send notifications when integrations sync
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Data retention</div>
                    <div className="text-sm text-muted-foreground">
                      Keep integration data for 30 days
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Security & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  All integrations are secured with OAuth 2.0 and we never store
                  your passwords. You can revoke access to any integration at
                  any time.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Privacy Policy
                  </Button>
                  <Button variant="outline" size="sm">
                    Security Documentation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
