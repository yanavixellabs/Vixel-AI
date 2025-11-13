import React, { useState, useCallback } from 'react';
import type { GeneratedImage } from '../App';
import { CloseIcon } from './icons/CloseIcon';
import type { WatermarkOptions, WatermarkPosition } from '../utils/fileUtils';
import { fileToBase64 } from '../utils/fileUtils';
import { UploadIcon } from './icons/UploadIcon';

export interface DownloadOptions {
  format: 'png' | 'jpeg';
  scale: number;
  watermark?: WatermarkOptions;
}

interface DownloadModalProps {
  image: GeneratedImage | null;
  onClose: () => void;
  onDownload: (options: DownloadOptions) => void;
}

const sizeOptions = [
    { label: 'Original', scale: 1 },
    { label: 'Large (1024px)', scale: 0.5 },
    { label: 'Medium (512px)', scale: 0.25 },
    { label: 'Small (256px)', scale: 0.125 },
];

const positionOptions: WatermarkPosition[] = [
    'top-left', 'top-center', 'top-right',
    'middle-left', 'center', 'middle-right',
    'bottom-left', 'bottom-center', 'bottom-right'
];

const CustomSelect: React.FC<{
    id: string;
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
}> = ({ id, label, value, onChange, children }) => (
     <div className="space-y-2">
        <label htmlFor={id} className="text-sm font-medium text-slate-600 dark:text-slate-400 block">{label}</label>
        <select
          id={id}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-brand-teal-500 focus:border-brand-teal-500 transition-colors appearance-none bg-no-repeat"
          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
          value={value}
          onChange={onChange}
        >
            {children}
        </select>
    </div>
);

const WatermarkLogoUpload: React.FC<{ onLogoChange: (dataUrl: string | null) => void }> = ({ onLogoChange }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFile = useCallback(async (file: File | null) => {
        if (file) {
            const { dataUrl } = await fileToBase64(file);
            setPreview(dataUrl);
            onLogoChange(dataUrl);
        } else {
            setPreview(null);
            onLogoChange(null);
        }
    }, [onLogoChange]);

    return (
        <div 
            onClick={() => document.getElementById('logo-upload-input')?.click()}
            className="relative flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-300 dark:border-slate-600 hover:border-brand-teal-400 transition-colors"
        >
            <input type="file" id="logo-upload-input" className="hidden" accept="image/png, image/jpeg, image/svg+xml" onChange={(e) => handleFile(e.target.files?.[0] ?? null)} />
            {preview ? (
                <img src={preview} alt="Logo preview" className="max-h-20 object-contain p-1" />
            ) : (
                <div className="text-slate-500 dark:text-slate-400 text-sm text-center">
                    <UploadIcon />
                    <p>Upload Logo</p>
                </div>
            )}
        </div>
    );
};


export const DownloadModal: React.FC<DownloadModalProps> = ({ image, onClose, onDownload }) => {
  const [format, setFormat] = useState<'png' | 'jpeg'>('png');
  const [scale, setScale] = useState<number>(1);
  const [addWatermark, setAddWatermark] = useState(false);
  const [watermarkType, setWatermarkType] = useState<'text' | 'logo'>('text');
  const [watermarkText, setWatermarkText] = useState(`© Vixel AI`);
  const [watermarkLogo, setWatermarkLogo] = useState<string | null>(null);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.7);
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>('bottom-right');
  const [watermarkSize, setWatermarkSize] = useState(0.2);


  if (!image) return null;

  const handleDownloadClick = () => {
    const options: DownloadOptions = { format, scale };
    if (addWatermark) {
        const content = watermarkType === 'logo' ? watermarkLogo : watermarkText;
        if (content) {
            options.watermark = {
                type: watermarkType,
                content,
                opacity: watermarkOpacity,
                position: watermarkPosition,
                size: watermarkSize
            };
        }
    }
    onDownload(options);
  };

  return (
    <div 
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-full md:w-1/2 flex-shrink-0 p-6">
          <img src={image.src} alt="Download preview" className="w-full h-auto object-contain rounded-lg aspect-[3/4] bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-4 p-6 pt-0 md:pt-6 overflow-y-auto">
            <div className="flex justify-between items-center sticky top-0 bg-white dark:bg-slate-900 pt-6 md:pt-0 pb-4 -mx-6 px-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-50">Download Poster</h3>
                <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                    <CloseIcon />
                </button>
            </div>
          
            <div className="space-y-4">
                <CustomSelect id="format" label="File Format" value={format} onChange={(e) => setFormat(e.target.value as 'png' | 'jpeg')}>
                    <option value="png">PNG</option>
                    <option value="jpeg">JPG</option>
                </CustomSelect>

                <CustomSelect id="size" label="Image Size" value={scale} onChange={(e) => setScale(Number(e.target.value))}>
                   {sizeOptions.map(opt => ( <option key={opt.label} value={opt.scale}>{opt.label}</option> ))}
                </CustomSelect>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 my-4"></div>

             <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="h-5 w-5 rounded border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-brand-teal-500 focus:ring-brand-teal-500" checked={addWatermark} onChange={() => setAddWatermark(!addWatermark)} />
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Add Watermark</span>
                </label>

                {addWatermark && (
                    <div className="space-y-4 animate-fade-in pl-8">
                        <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
                            <button onClick={() => setWatermarkType('text')} className={`p-2 rounded-md text-sm font-semibold ${watermarkType === 'text' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-teal-600 dark:text-brand-teal-300' : 'text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>Text</button>
                            <button onClick={() => setWatermarkType('logo')} className={`p-2 rounded-md text-sm font-semibold ${watermarkType === 'logo' ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-teal-600 dark:text-brand-teal-300' : 'text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>Logo</button>
                        </div>
                        
                        {watermarkType === 'text' ? (
                            <input type="text" value={watermarkText} onChange={e => setWatermarkText(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-3 text-sm" placeholder="Watermark text" />
                        ) : (
                            <WatermarkLogoUpload onLogoChange={setWatermarkLogo} />
                        )}

                        <div>
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-2">Position</label>
                             <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                {positionOptions.map(pos => (
                                    <button key={pos} onClick={() => setWatermarkPosition(pos)} className={`h-8 rounded-md flex items-center justify-center transition-colors ${watermarkPosition === pos ? 'bg-white dark:bg-slate-700 shadow-sm' : 'hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
                                        <div className={`h-2.5 w-2.5 rounded-full ${watermarkPosition === pos ? 'bg-brand-teal-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-2">Opacity ({Math.round(watermarkOpacity * 100)}%)</label>
                            <input type="range" min="0.1" max="1" step="0.05" value={watermarkOpacity} onChange={e => setWatermarkOpacity(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-teal-500" />
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 mt-auto pt-4">
                <button onClick={onClose} className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-4 rounded-lg transition-colors">
                    Cancel
                </button>
                <button onClick={handleDownloadClick} className="w-full flex items-center justify-center bg-brand-teal-500 hover:bg-brand-teal-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                    Download
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};