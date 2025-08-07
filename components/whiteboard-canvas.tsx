'use client';

import { TLStoreSnapshot } from '@tldraw/tldraw';
import { useState } from 'react';
import { TldrawCanvas } from './tldraw-canvas';

type WhiteboardData = TLStoreSnapshot;

interface WhiteboardCanvasProps {
  canvasId: string;
  canvasData?: WhiteboardData;
  onSave?: (data: WhiteboardData) => void;
  onShare?: () => void;
  onExport?: (format: 'png' | 'svg' | 'json') => void;
  isReadOnly?: boolean;
  collaborators?: Array<{
    id: string;
    name: string;
    color: string;
    isOnline: boolean;
  }>;
}

export function WhiteboardCanvas({
  canvasId,
  canvasData,
  onSave,
  onShare,
  onExport,
  isReadOnly = false,
  collaborators = [],
}: WhiteboardCanvasProps) {
  const handleSaveInternal = (data: WhiteboardData) => {
    onSave?.(data);
  };

  const handleExportInternal = (format: 'png' | 'svg' | 'json') => {
    onExport?.(format);
  };

  return (
    <TldrawCanvas
      canvasId={canvasId}
      initialData={canvasData}
      onSave={handleSaveInternal}
      onShare={onShare}
      onExport={handleExportInternal}
      isReadOnly={isReadOnly}
      collaborators={collaborators}
    />
  );
}

export function WhiteboardDemo() {
  const [canvasData, setCanvasData] = useState<WhiteboardData | undefined>(
    undefined
  );

  const handleSave = (data: WhiteboardData) => {
    setCanvasData(data);
    console.log('Canvas saved:', data);
  };

  const handleShare = () => {
    console.log('Share canvas');
  };

  const handleExport = (format: 'png' | 'svg' | 'json') => {
    console.log(`Exporting canvas as ${format}`);
  };

  return (
    <div className="w-full h-full">
      <WhiteboardCanvas
        canvasId="demo-canvas"
        canvasData={canvasData}
        onSave={handleSave}
        onShare={handleShare}
        onExport={handleExport}
      />
    </div>
  );
}
