'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Editor, Tldraw, TLStoreSnapshot, useEditor } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { Download, Palette, Save, Share2, Users2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface TldrawCanvasProps {
  canvasId: string;
  initialData?: TLStoreSnapshot | null;
  onSave?: (data: TLStoreSnapshot) => void;
  onShare?: () => void;
  onExport?: (type: 'png' | 'svg' | 'json') => void;
  isReadOnly?: boolean;
  collaborators?: Array<{
    id: string;
    name: string;
    color: string;
    isOnline: boolean;
  }>;
}

export function TldrawCanvas({
  canvasId,
  initialData,
  onSave,
  onShare,
  onExport,
  isReadOnly = false,
  collaborators = [],
}: TldrawCanvasProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [canvasData, setCanvasData] = useState<TLStoreSnapshot | null>(null);
  const editorRef = useRef<Editor | null>(null);

  useEffect(() => {
    setIsLoaded(true);
    console.log(canvasData);
  }, []);

  const getValidInitialData = (): TLStoreSnapshot | null => {
    if (!initialData || typeof initialData !== 'object') {
      return null;
    }

    if (
      initialData.schema &&
      initialData.store &&
      typeof initialData.store === 'object'
    ) {
      return initialData as unknown as TLStoreSnapshot;
    }

    return null;
  };

  const handleSave = () => {
    if (editorRef.current) {
      const data = editorRef.current.store.getSnapshot();
      setCanvasData(data);
      onSave?.(data);
    }
  };

  const handleExport = (type: 'png' | 'svg' | 'json' = 'png') => {
    if (!editorRef.current) {
      console.error('Editor not initialized');
      return;
    }

    try {
      if (type === 'json') {
        const snapshot = editorRef.current.store.getSnapshot();
        const dataStr = JSON.stringify(snapshot);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.download = `canvas-${canvasId}.json`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        // PNG/SVG export logic (simplified example)
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        canvas.width = 1920;
        canvas.height = 1080;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `canvas-${canvasId}.${type}`;
        link.href = dataUrl;
        link.click();
      }
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      onExport?.(type);
    }
  };

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-white border rounded-lg">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center">
              <Palette className="h-4 w-4 text-white" />
            </div>
            <span className="font-medium">Loading tldraw...</span>
          </div>
        </div>
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">
              Initializing canvas...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white border rounded-lg flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center">
            <Palette className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium">Interactive Whiteboard</span>
          {isReadOnly && <Badge variant="secondary">Read Only</Badge>}
        </div>

        <div className="flex items-center gap-2">
          {collaborators.length > 0 && (
            <div className="flex items-center gap-1">
              <Users2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {collaborators.length} online
              </span>
            </div>
          )}

          <Button size="sm" variant="outline" onClick={onShare}>
            <Share2 className="mr-2 h-3 w-3" />
            Share
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => handleExport('png')}
          >
            <Download className="mr-2 h-3 w-3" />
            Export
          </Button>

          {!isReadOnly && (
            <Button size="sm" onClick={handleSave}>
              <Save className="mr-2 h-3 w-3" />
              Save
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 relative">
        <Tldraw
          onMount={(editor) => {
            editorRef.current = editor;
            const validInitialData = getValidInitialData();
            if (validInitialData) {
              try {
                editor.store.loadSnapshot(validInitialData);
              } catch (error) {
                console.error('Error loading canvas data:', error);
              }
            }
            if (isReadOnly) {
              editor.updateInstanceState({ isReadonly: true });
            }
          }}
        />
      </div>
    </div>
  );
}

export function useTldrawEditor() {
  return useEditor();
}
