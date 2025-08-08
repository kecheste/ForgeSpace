'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { usersAPI } from '@/lib/api/users';
import { workspacesAPI } from '@/lib/api/workspaces';
import { SignIn, SignUp, useUser } from '@clerk/nextjs';
import {
  ArrowRight,
  Building2,
  CheckCircle,
  ChevronLeftIcon,
  Clock,
  LogIn,
  Mail,
  UserPlus,
  Users,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Invitation {
  id: string;
  workspace_id: string;
  email: string;
  role: string;
  expires_at: string;
  accepted_at: string | null;
  workspace: {
    name: string;
    description?: string;
  };
  inviter: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const roleColors = {
  admin: 'bg-purple-100 text-purple-800',
  member: 'bg-blue-100 text-blue-800',
  viewer: 'bg-gray-100 text-gray-800',
};

const roleIcons = {
  admin: Users,
  member: Building2,
  viewer: Users,
};

export default function InvitationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const { toast } = useToast();

  const invitationId = params.id as string;

  useEffect(() => {
    if (isLoaded) {
      loadInvitation();
    }
  }, [isLoaded, invitationId]);

  const loadInvitation = async () => {
    try {
      setLoading(true);
      setError(null);

      const invitationData = await workspacesAPI.getInvitation(
        invitationId,
        ''
      );
      setInvitation(invitationData);
    } catch (error) {
      console.error('Error loading invitation:', error);
      setError('Failed to load invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptInvitation = async () => {
    if (!user || !invitation) return;

    try {
      setAccepting(true);

      const userEmail = user.emailAddresses[0]?.emailAddress;
      if (userEmail !== invitation.email) {
        toast({
          title: 'Email Mismatch',
          description: `This invitation is for ${invitation.email}. Please sign in with that email address.`,
          variant: 'destructive',
        });
        return;
      }

      // Create or update user profile
      const profile = await usersAPI.createOrUpdateProfile({
        clerk_user_id: user.id,
        email: userEmail || '',
        first_name: user.firstName || '',
        last_name: user.lastName || '',
        image_url: user.imageUrl || '',
      });

      // Accept the invitation
      await workspacesAPI.acceptInvitation(
        invitationId,
        invitation.email,
        profile
      );

      toast({
        title: 'Invitation accepted!',
        description: `You've successfully joined ${invitation.workspace.name}`,
      });

      // Redirect to the workspace
      router.push(`/dashboard/workspaces/${invitation.workspace_id}`);
    } catch (error) {
      console.error('Error accepting invitation:', error);
      toast({
        title: 'Error',
        description: 'Failed to accept invitation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAccepting(false);
    }
  };

  const handleDeclineInvitation = () => {
    toast({
      title: 'Invitation declined',
      description:
        'You can always accept this invitation later if you change your mind.',
    });
    router.push('/');
  };

  const handleSignIn = () => {
    setAuthMode('signin');
    setShowAuth(true);
  };

  const handleSignUp = () => {
    setAuthMode('signup');
    setShowAuth(true);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Loading invitation...
          </p>
        </div>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="text-center p-8">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              Invitation Not Found
            </h2>
            <p className="text-muted-foreground mb-4">
              This invitation may have expired or is no longer valid.
            </p>
            <Button asChild>
              <Link href="/">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired = new Date(invitation.expires_at) < new Date();
  const isAccepted = invitation.accepted_at !== null;
  const RoleIcon = roleIcons[invitation.role as keyof typeof roleIcons];
  const userEmail = user?.emailAddresses[0]?.emailAddress;
  const emailMatches = userEmail === invitation.email;

  // Show authentication form if user is not authenticated
  if (showAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <Button
              variant="ghost"
              onClick={() => setShowAuth(false)}
              className="absolute left-4 top-4 hover:bg-transparent cursor-pointer hover:text-gray-500 transition-all duration-300"
            >
              <ChevronLeftIcon width={5} height={5} className="mb-0.5" />
              Back to Invitation
            </Button>
            <CardTitle className="text-2xl">
              {authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </CardTitle>
            <CardDescription>
              {authMode === 'signin'
                ? `Sign in with ${invitation.email} to accept the invitation`
                : `Create an account with ${invitation.email} to accept the invitation`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {authMode === 'signin' ? (
              <SignIn
                forceRedirectUrl={`/invite/${invitationId}`}
                appearance={{
                  elements: {
                    formButtonPrimary: 'bg-primary hover:bg-primary/90',
                  },
                }}
              />
            ) : (
              <SignUp
                forceRedirectUrl={`/invite/${invitationId}`}
                appearance={{
                  elements: {
                    formButtonPrimary: 'bg-primary hover:bg-primary/90',
                  },
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-pink-100 to-blue-200 flex items-center justify-center">
              <Image
                src="/forgespace-logo.png"
                alt="ForgeSpace Logo"
                width={36}
                height={36}
              />
            </div>
          </div>
          <CardTitle className="text-2xl">Workspace Invitation</CardTitle>
          <CardDescription>
            You've been invited to join a collaborative workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Workspace Details */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold">
                {invitation.workspace.name}
              </h3>
              {invitation.workspace.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {invitation.workspace.description}
                </p>
              )}
            </div>

            {/* Inviter Info */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {invitation.inviter.first_name?.[0]}
                  {invitation.inviter.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {invitation.inviter.first_name} {invitation.inviter.last_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {invitation.inviter.email}
                </p>
              </div>
            </div>

            {/* Role Badge */}
            <div className="flex justify-center">
              <Badge
                className={
                  roleColors[invitation.role as keyof typeof roleColors]
                }
              >
                <RoleIcon className="mr-1 h-3 w-3" />
                {invitation.role}
              </Badge>
            </div>

            {/* Email Info */}
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <Mail className="h-4 w-4 text-blue-500" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Invitation sent to <strong>{invitation.email}</strong>
              </p>
            </div>
          </div>

          {/* Status Messages */}
          {isExpired && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <Clock className="h-4 w-4 text-red-500" />
              <p className="text-sm text-red-700 dark:text-red-300">
                This invitation has expired
              </p>
            </div>
          )}

          {isAccepted && (
            <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <p className="text-sm text-green-700 dark:text-green-300">
                You've already accepted this invitation
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {!isExpired && !isAccepted && (
            <>
              {/* User is signed in and email matches */}
              {user && emailMatches && (
                <div className="space-y-3">
                  <Button
                    onClick={handleAcceptInvitation}
                    disabled={accepting}
                    className="w-full cursor-pointer"
                  >
                    {accepting ? 'Accepting...' : 'Accept Invitation'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDeclineInvitation}
                    className="w-full text-red-600 hover:bg-red-50 hover:text-red-500 border-red-100 cursor-pointer"
                  >
                    Decline
                  </Button>
                </div>
              )}

              {/* User is signed in but email doesn't match */}
              {user && !emailMatches && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                    <Mail className="h-4 w-4 text-yellow-500" />
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      This invitation is for <strong>{invitation.email}</strong>
                    </p>
                  </div>
                  <Button onClick={handleSignIn} className="w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In with {invitation.email}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSignUp}
                    className="w-full"
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account with {invitation.email}
                  </Button>
                </div>
              )}

              {/* User is not signed in */}
              {!user && (
                <div className="space-y-3">
                  <Button onClick={handleSignUp} className="w-full">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account to Accept
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSignIn}
                    className="w-full"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In to Accept
                  </Button>
                </div>
              )}
            </>
          )}

          {isAccepted && (
            <Button asChild className="w-full">
              <Link href={`/dashboard/workspaces/${invitation.workspace_id}`}>
                Go to Workspace
              </Link>
            </Button>
          )}

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground">
            <p>
              This invitation expires on{' '}
              {new Date(invitation.expires_at).toLocaleDateString()}
            </p>
            <p className="mt-1">
              Need help? Contact{' '}
              <a
                href={`mailto:${invitation.inviter.email}`}
                className="underline"
              >
                {invitation.inviter.first_name}
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
