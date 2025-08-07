import { type NextRequest, NextResponse } from 'next/server';
import { notificationQueue } from '@/lib/services/notification-queue';

export async function POST(request: NextRequest) {
  try {
    // Verify the request is from a cron job or authorized source
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Process pending notification jobs
    await notificationQueue.processPendingJobs();

    return NextResponse.json({
      success: true,
      message: 'Notification jobs processed',
    });
  } catch (error) {
    console.error('Error processing notifications:', error);
    return NextResponse.json(
      { error: 'Failed to process notifications' },
      { status: 500 }
    );
  }
}

// Allow GET for health checks
export async function GET() {
  return NextResponse.json({ status: 'ok', service: 'notification-processor' });
}
