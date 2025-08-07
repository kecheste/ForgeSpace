import { whiteboardsAPI } from '@/lib/api/whiteboards';
import { auth } from '@clerk/nextjs/server';
import { TLStoreSnapshot } from '@tldraw/tldraw';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const canvas = await whiteboardsAPI.getCanvas(id);

    return NextResponse.json(canvas);
  } catch (error) {
    console.error('Error fetching whiteboard:', error);
    return NextResponse.json(
      { error: 'Failed to fetch whiteboard' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, type, canvas_data } = body;

    const updates: {
      id?: string | undefined;
      name?: string | undefined;
      description?: string | null | undefined;
      type?: 'mindmap' | 'flowchart' | 'timeline' | 'freeform' | undefined;
      workspace_id?: string | undefined;
      created_at?: string | undefined;
      updated_at?: string | undefined;
    } = {};

    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (type !== undefined) updates.type = type;
    if (canvas_data !== undefined) {
      await whiteboardsAPI.saveCanvasData(
        id,
        canvas_data as unknown as TLStoreSnapshot,
        userId
      );
    }

    const canvas = await whiteboardsAPI.updateCanvas(id, updates);

    return NextResponse.json(canvas);
  } catch (error) {
    console.error('Error updating whiteboard:', error);
    return NextResponse.json(
      { error: 'Failed to update whiteboard' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await whiteboardsAPI.deleteCanvas(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting whiteboard:', error);
    return NextResponse.json(
      { error: 'Failed to delete whiteboard' },
      { status: 500 }
    );
  }
}
