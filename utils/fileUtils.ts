/**
 * Converts a File object into a base64 encoded string.
 * @param file The file to convert.
 * @returns A promise that resolves to an object containing the base64 string and MIME type.
 */
export const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string; dataUrl: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const [header, base64] = dataUrl.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1];
      
      if (base64 && mimeType) {
        resolve({ base64, mimeType, dataUrl });
      } else {
        reject(new Error('Failed to parse file data.'));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Converts a data URL string into its base64 and MIME type parts.
 * @param dataUrl The data URL (e.g., "data:image/png;base64,...").
 * @returns An object containing the base64 string and MIME type.
 */
export const dataUrlToParts = (dataUrl: string): { base64: string; mimeType: string } => {
  const match = dataUrl.match(/^data:(.*);base64,(.*)$/);
  if (!match) {
    throw new Error('Invalid data URL format for parsing.');
  }
  const mimeType = match[1];
  const base64 = match[2];
  return { base64, mimeType };
};

export type WatermarkPosition = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface WatermarkOptions {
  type: 'text' | 'logo';
  content: string;
  opacity: number;
  position: WatermarkPosition;
  size: number;
}
interface DownloadOptions {
  filename: string;
  format: 'png' | 'jpeg';
  scale: number;
  watermark?: WatermarkOptions;
}

/**
 * Triggers a browser download for a given data URL with specified options for format and size.
 * @param dataUrl The data URL of the file to download.
 * @param options The download options including filename, format, and scale.
 */
export const downloadImageWithOptions = (dataUrl: string, options: DownloadOptions): void => {
  const { filename, format, scale, watermark } = options;
  const image = new Image();
  image.src = dataUrl;
  image.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error("Could not get canvas context.");
      // Fallback to simple download if canvas fails
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${filename}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const newWidth = image.width * scale;
    const newHeight = image.height * scale;

    canvas.width = newWidth;
    canvas.height = newHeight;
    
    // Fill background with white for JPGs to avoid black background on transparency
    if (format === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, newWidth, newHeight);
    }
    
    ctx.drawImage(image, 0, 0, newWidth, newHeight);

    const applyWatermark = () => {
        if (!watermark) return Promise.resolve();
        
        return new Promise<void>((resolve) => {
             if (watermark.type === 'logo') {
                const logo = new Image();
                logo.src = watermark.content;
                logo.onload = () => {
                    drawWatermark(ctx, { ...watermark, content: logo }, newWidth, newHeight);
                    resolve();
                };
                logo.onerror = () => {
                    console.error("Failed to load watermark logo.");
                    resolve(); // Resolve anyway to not block download
                };
            } else { // 'text'
                drawWatermark(ctx, watermark, newWidth, newHeight);
                resolve();
            }
        });
    };

    applyWatermark().then(() => {
        const mimeType = `image/${format}`;
        const newImageDataUrl = canvas.toDataURL(mimeType, 0.9); // 0.9 quality for JPG

        const link = document.createElement('a');
        link.href = newImageDataUrl;
        link.download = `${filename}.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
  };
  image.onerror = () => {
      console.error("Failed to load image for download processing.");
  }
};

// FIX: Create a more specific type for the drawWatermark function to handle both string and HTMLImageElement content.
type DrawWatermarkOptions = Omit<WatermarkOptions, 'content'> & {
  content: string | HTMLImageElement;
};

function drawWatermark(ctx: CanvasRenderingContext2D, watermark: DrawWatermarkOptions, canvasWidth: number, canvasHeight: number) {
    ctx.globalAlpha = watermark.opacity;
    const margin = 0.05 * Math.min(canvasWidth, canvasHeight);
    
    let x = 0, y = 0;
    
    if (watermark.type === 'text' && typeof watermark.content === 'string') {
        const fontSize = Math.max(12, Math.floor(canvasWidth * watermark.size * 0.2));
        ctx.font = `${fontSize}px Inter, sans-serif`;
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(1, fontSize / 12);
        ctx.measureText(watermark.content);

        // Position Logic
        if (watermark.position.includes('left')) { x = margin; ctx.textAlign = 'left'; }
        else if (watermark.position.includes('center')) { x = canvasWidth / 2; ctx.textAlign = 'center'; }
        else if (watermark.position.includes('right')) { x = canvasWidth - margin; ctx.textAlign = 'right'; }
        
        if (watermark.position.includes('top')) { y = margin; ctx.textBaseline = 'top'; }
        else if (watermark.position.includes('middle')) { y = canvasHeight / 2; ctx.textBaseline = 'middle'; }
        else if (watermark.position.includes('bottom')) { y = canvasHeight - margin; ctx.textBaseline = 'bottom'; }
        
        ctx.strokeText(watermark.content, x, y);
        ctx.fillText(watermark.content, x, y);

    // FIX: Add a type check for 'object' before using 'instanceof' to satisfy TypeScript's type checker with union types.
    } else if (watermark.type === 'logo' && typeof watermark.content === 'object' && watermark.content instanceof HTMLImageElement) {
        const logo = watermark.content;
        const logoWidth = canvasWidth * watermark.size;
        const logoHeight = (logo.height / logo.width) * logoWidth;
        
        // Position Logic
        if (watermark.position.includes('left')) x = margin;
        else if (watermark.position.includes('center')) x = (canvasWidth - logoWidth) / 2;
        else if (watermark.position.includes('right')) x = canvasWidth - logoWidth - margin;
        
        if (watermark.position.includes('top')) y = margin;
        else if (watermark.position.includes('middle')) y = (canvasHeight - logoHeight) / 2;
        else if (watermark.position.includes('bottom')) y = canvasHeight - logoHeight - margin;
        
        ctx.drawImage(logo, x, y, logoWidth, logoHeight);
    }
    
    ctx.globalAlpha = 1.0;
}