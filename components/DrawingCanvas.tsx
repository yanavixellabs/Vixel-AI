import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react';

interface DrawingCanvasProps {
  src: string;
  brushSize: number;
  enabled: boolean;
}

export const DrawingCanvas = forwardRef<{
  exportMask: () => string | null;
  clear: () => void;
  undo: () => void;
}, DrawingCanvasProps>(({ src, brushSize, enabled }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = src;
    image.onload = () => {
      const container = containerRef.current;
      if (!container) return;

      const { clientWidth, clientHeight } = container;
      const imageAspectRatio = image.naturalWidth / image.naturalHeight;
      const containerAspectRatio = clientWidth / clientHeight;

      let renderWidth, renderHeight;

      if (imageAspectRatio > containerAspectRatio) {
        renderWidth = clientWidth;
        renderHeight = clientWidth / imageAspectRatio;
      } else {
        renderHeight = clientHeight;
        renderWidth = clientHeight * imageAspectRatio;
      }
      
      setImageSize({ width: renderWidth, height: renderHeight });

      [imageCanvasRef, drawingCanvasRef].forEach(canvasRef => {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = renderWidth;
          canvas.height = renderHeight;
        }
      });
      
      const imgCtx = imageCanvasRef.current?.getContext('2d');
      if(imgCtx) {
          imgCtx.drawImage(image, 0, 0, renderWidth, renderHeight);
      }
      clearMask();
    };
  }, [src]);
  
  const getMousePos = (e: React.MouseEvent): { x: number; y: number } | null => {
      const canvas = drawingCanvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
      };
  };

  const saveToHistory = () => {
    const ctx = drawingCanvasRef.current?.getContext('2d');
    if (ctx && drawingCanvasRef.current) {
      const imageData = ctx.getImageData(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
      setHistory(prev => [...prev.slice(-10), imageData]); // Keep last 10 states
    }
  };

  const startDrawing = (e: React.MouseEvent) => {
    if (!enabled) return;
    saveToHistory();
    setIsDrawing(true);
    draw(e);
  };

  const finishDrawing = () => {
    setIsDrawing(false);
    const ctx = drawingCanvasRef.current?.getContext('2d');
    ctx?.beginPath();
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !enabled) return;
    const pos = getMousePos(e);
    if (!pos) return;

    const ctx = drawingCanvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'white';
      ctx.lineWidth = brushSize;
      
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const clearMask = () => {
    const canvas = drawingCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHistory([]);
    }
  };

  const undo = () => {
      if (history.length === 0) return;
      const lastState = history[history.length - 1];
      const ctx = drawingCanvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.putImageData(lastState, 0, 0);
      }
      setHistory(prev => prev.slice(0, -1));
  }

  useImperativeHandle(ref, () => ({
    exportMask: () => {
        const canvas = drawingCanvasRef.current;
        if (!canvas) return null;
        // Check if mask is empty
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;
        const pixelBuffer = new Uint32Array(ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
        const isEmpty = !pixelBuffer.some(color => color !== 0);

        if (isEmpty) return null;
        
        return canvas.toDataURL('image/png');
    },
    clear: clearMask,
    undo: undo,
  }));

  const cursorStyle = enabled ? 'none' : 'default';

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center cursor-none" style={{ cursor: cursorStyle }}>
        <canvas ref={imageCanvasRef} className="absolute inset-0 m-auto" style={{ width: imageSize.width, height: imageSize.height }} />
        <canvas 
            ref={drawingCanvasRef}
            className="absolute inset-0 m-auto"
            style={{ width: imageSize.width, height: imageSize.height }}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseOut={finishDrawing}
            onMouseMove={draw}
        />
        {enabled && <BrushCursor brushSize={brushSize} />}
    </div>
  );
});

const BrushCursor: React.FC<{ brushSize: number }> = ({ brushSize }) => {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            if (cursorRef.current) {
                cursorRef.current.style.left = `${e.clientX}px`;
                cursorRef.current.style.top = `${e.clientY}px`;
            }
        };
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    return (
        <div 
            ref={cursorRef}
            className="fixed pointer-events-none rounded-full border-2 border-white bg-black/20 -translate-x-1/2 -translate-y-1/2 shadow-lg"
            style={{ width: brushSize, height: brushSize }}
        />
    );
};
