import React from 'react';
import { ImageUpload } from './ImageUpload';
import { LoadingSpinnerIcon } from './icons/LoadingSpinnerIcon';
import { MagicWandIcon } from './icons/MagicWandIcon';
import { StyleSelector } from './StyleSelector';

interface GeneratorControlsProps {
  imageFiles: File[];
  selectedImageIndex: number | null;
  onFilesChange: (files: File[]) => void;
  onSelectImage: (index: number) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  style: string;
  onStyleChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isGeneratingDescription: boolean;
  onMagicDescription: () => void;
  numImages: number;
  onNumImagesChange: (value: number) => void;
  aspectRatio: string;
  onAspectRatioChange: (value: string) => void;
}

export const GeneratorControls: React.FC<GeneratorControlsProps> = ({
  imageFiles,
  selectedImageIndex,
  onFilesChange,
  onSelectImage,
  description,
  onDescriptionChange,
  style,
  onStyleChange,
  onGenerate,
  isLoading,
  isGeneratingDescription,
  onMagicDescription,
  numImages,
  onNumImagesChange,
  aspectRatio,
  onAspectRatioChange,
}) => {
  const productDesignStyles = [
    'Minimalist',
    'Studio Mode',
    'Modern / Corporate',
    'Flat Design',
    'Gradient / Neo-Modern',
    'Retro / Vintage',
    'Bold / Typographic',
    'Geometric / Abstract',
    'Organic / Natural',
    'Futuristic / Tech',
    'Grunge / Urban',
    'Playful / Colorful',
    'Luxury / Elegant',
    'Artistic / Illustrative',
    'Editorial / Layout Focused',
    'Experimental / Abstract Expression',
  ];

  const numImageOptions = [2, 4, 6];

  const aspectRatioOptions = [
      { label: '1:1', value: '1:1' },
      { label: '4:5', value: '4:5' },
      { label: '9:16', value: '9:16' },
      { label: '16:9', value: '16:9' },
  ]

  return (
    <aside className="w-full lg:w-96 xl:w-[420px] flex-shrink-0 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6 lg:overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-50">Controls</h2>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">1. Add Image (up to 4)</label>
        <ImageUpload
            files={imageFiles}
            selectedFileIndex={selectedImageIndex}
            onFilesChange={onFilesChange}
            onSelect={onSelectImage}
            maxFiles={4}
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
            <label htmlFor="description" className="text-sm font-medium text-slate-600 dark:text-slate-400">2. Description</label>
            <button
                onClick={onMagicDescription}
                disabled={isGeneratingDescription || !imageFiles.length || isLoading}
                className="flex items-center gap-1.5 text-xs font-semibold text-brand-teal-500 hover:text-brand-teal-600 dark:hover:text-brand-teal-400 transition-colors disabled:text-slate-400 disabled:cursor-not-allowed"
            >
                {isGeneratingDescription ? (
                    <>
                        <LoadingSpinnerIcon className="h-4 w-4 text-brand-teal-500" />
                        <span>Generating...</span>
                    </>
                ) : (
                    <>
                        <MagicWandIcon />
                        <span>Magic AI</span>
                    </>
                )}
            </button>
        </div>
        <textarea
          id="description"
          rows={4}
          className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-brand-teal-500/50 focus:border-brand-teal-500 transition-colors"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder={"e.g., Headline, Sub-headline, Promotion"}
        />
      </div>

      <StyleSelector 
        label="3. Design Style"
        options={productDesignStyles}
        value={style}
        onChange={onStyleChange}
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block">4. Aspect Ratio</label>
        <div className="grid grid-cols-4 gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
            {aspectRatioOptions.map(opt => (
                <button 
                    key={opt.value} 
                    onClick={() => onAspectRatioChange(opt.value)}
                    className={`flex justify-center items-center p-2.5 rounded-md text-sm font-semibold transition-colors ${aspectRatio === opt.value ? 'bg-brand-teal-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block">5. Number of Images</label>
        <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
            {numImageOptions.map(num => (
                <button 
                    key={num} 
                    onClick={() => onNumImagesChange(num)}
                    className={`flex justify-center items-center p-2.5 rounded-md text-sm font-semibold transition-colors ${numImages === num ? 'bg-brand-teal-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                >
                    {num}
                </button>
            ))}
        </div>
      </div>


      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full flex items-center justify-center bg-brand-teal-500 hover:bg-brand-teal-600 disabled:bg-brand-teal-500/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors mt-auto"
      >
        {isLoading ? (
          <>
            <LoadingSpinnerIcon className="-ml-1 mr-3 h-5 w-5 text-white" />
            Generating...
          </>
        ) : (
          'Generate'
        )}
      </button>
    </aside>
  );
};
