import { whiteboardsAPI } from '@/lib/api/whiteboards';
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API route for managing whiteboards (canvases).
 * Supports GET to fetch all canvases and POST to create a new canvas.
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const canvases = await whiteboardsAPI.getCanvases(userId);

    return NextResponse.json(canvases);
  } catch (error) {
    console.error('Error fetching whiteboards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch whiteboards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, type, workspace_id, idea_id } = body;

    if (!name || !workspace_id) {
      return NextResponse.json(
        { error: 'Name and workspace_id are required' },
        { status: 400 }
      );
    }

    const canvas = await whiteboardsAPI.createCanvas(
      {
        name,
        description,
        type: type || 'freeform',
        workspace_id,
        idea_id,
        created_by: userId, // This will be overridden by the API
      },
      userId
    );

    return NextResponse.json(canvas, { status: 201 });
  } catch (error) {
    console.error('Error creating whiteboard:', error);
    return NextResponse.json(
      { error: 'Failed to create whiteboard' },
      { status: 500 }
    );
  }
}
