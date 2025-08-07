'use client';

import { useSupabase } from '@/components/providers/supabase-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Wifi, WifiOff } from 'lucide-react';

interface RealtimeIndicatorProps {
  activeUsers?: { user_id: string; user_name: string; user_avatar?: string }[];
  className?: string;
}

export function RealtimeIndicator({
  activeUsers = [],
  className,
}: RealtimeIndicatorProps) {
  const { isConnected } = useSupabase();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge
              variant={isConnected ? 'default' : 'destructive'}
              className="flex items-center gap-1"
            >
              {isConnected ? (
                <Wifi className="h-3 w-3" />
              ) : (
                <WifiOff className="h-3 w-3" />
              )}
              {isConnected ? 'Live' : 'Offline'}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            {isConnected ? 'Real-time collaboration active' : 'Connection lost'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Active Users */}
      {activeUsers.length > 0 && (
        <div className="flex items-center gap-1">
          <div className="flex -space-x-2">
            {activeUsers.slice(0, 3).map((user, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-6 w-6 border-2 border-background">
                      <AvatarImage
                        src={user.user_avatar || '/placeholder.svg'}
                      />
                      <AvatarFallback className="text-xs">
                        {user.user_name?.charAt(0)?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>{user.user_name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
            {activeUsers.length > 3 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted border-2 border-background text-xs">
                +{activeUsers.length - 3}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
