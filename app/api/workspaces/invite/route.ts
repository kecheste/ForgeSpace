import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { workspacesAPI } from '@/lib/api/workspaces';
import { createClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { workspaceId, email, role } = await request.json();

    if (!workspaceId || !email) {
      return NextResponse.json(
        { error: 'Workspace ID and email are required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const validRoles = ['admin', 'member', 'viewer'];
    const validRole = validRoles.includes(role) ? role : 'member';

    const supabase = createClient();
    const { data: userProfile, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('clerk_user_id', userId)
      .single();

    if (userError || !userProfile) {
      console.error('Error getting user profile:', userError);
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    console.log(
      `📧 API: Inviting ${email} to workspace ${workspaceId} as ${validRole}`
    );

    const result = await workspacesAPI.inviteMember(
      workspaceId,
      email,
      validRole as 'admin' | 'member' | 'viewer',
      userProfile.id
    );

    return NextResponse.json({
      success: true,
      invitation: result.invitation,
      isExistingUser: result.isExistingUser,
      user: result.user,
    });
  } catch (error) {
    console.error('Error in workspace invitation API:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to send invitation',
      },
      { status: 500 }
    );
  }
}
