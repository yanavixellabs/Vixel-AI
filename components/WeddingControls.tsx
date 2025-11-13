import React from 'react';
import { ImageUpload } from './ImageUpload';
import { LoadingSpinnerIcon } from './icons/LoadingSpinnerIcon';

export type LocationType = 'Indoor' | 'Outdoor';
export type ConceptType = 'Prewedding' | 'Wedding';

interface WeddingControlsProps {
  manFile: File | null;
  onManFileChange: (file: File | null) => void;
  womanFile: File | null;
  onWomanFileChange: (file: File | null) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  conceptType: ConceptType;
  onConceptTypeChange: (type: ConceptType) => void;
  locationType: LocationType;
  onLocationTypeChange: (type: LocationType) => void;
  theme: string;
  onThemeChange: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  numImages: number;
  onNumImagesChange: (value: number) => void;
  aspectRatio: string;
  onAspectRatioChange: (value: string) => void;
}

export const WeddingControls: React.FC<WeddingControlsProps> = ({
  manFile,
  onManFileChange,
  womanFile,
  onWomanFileChange,
  description,
  onDescriptionChange,
  conceptType,
  onConceptTypeChange,
  locationType,
  onLocationTypeChange,
  theme,
  onThemeChange,
  onGenerate,
  isLoading,
  numImages,
  onNumImagesChange,
  aspectRatio,
  onAspectRatioChange,
}) => {
  
  const numImageOptions = [2, 4, 6];
  const aspectRatioOptions = [
      { label: '1:1', value: '1:1' },
      { label: '4:5', value: '4:5' },
      { label: '9:16', value: '9:16' },
      { label: '16:9', value: '16:9' },
  ];
  
  const themeOptions = [
    "Classic & Elegant",
    "Modern & Minimalist",
    "Rustic & Bohemian",
    "Vintage Romance",
    "Fairytale & Fantasy",
    "Tropical Beach",
    "Majestic Mountains",
    "Urban Cityscape",
    "Western Cowboy",
    "Adat Jawa",
    "Adat Sunda",
    "Islamic/Muslim Modest",
  ];

  const handleManFileChange = (files: File[]) => onManFileChange(files[0] || null);
  const handleWomanFileChange = (files: File[]) => onWomanFileChange(files[0] || null);

  return (
    <aside className="w-full lg:w-96 xl:w-[420px] flex-shrink-0 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-6 lg:overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-50">Controls</h2>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">1. Upload Photos</label>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <p className="text-center text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Foto Pria</p>
                <ImageUpload
                    files={manFile ? [manFile] : []}
                    selectedFileIndex={manFile ? 0 : null}
                    onFilesChange={handleManFileChange}
                    onSelect={() => {}}
                    maxFiles={1}
                />
            </div>
             <div>
                <p className="text-center text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Foto Wanita</p>
                <ImageUpload
                    files={womanFile ? [womanFile] : []}
                    selectedFileIndex={womanFile ? 0 : null}
                    onFilesChange={handleWomanFileChange}
                    onSelect={() => {}}
                    maxFiles={1}
                />
            </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">2. Concept Type</label>
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
            <button 
                onClick={() => onConceptTypeChange('Prewedding')}
                className={`flex justify-center items-center p-2.5 rounded-md text-sm font-semibold transition-colors ${conceptType === 'Prewedding' ? 'bg-brand-teal-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
                Prewedding
            </button>
             <button 
                onClick={() => onConceptTypeChange('Wedding')}
                className={`flex justify-center items-center p-2.5 rounded-md text-sm font-semibold transition-colors ${conceptType === 'Wedding' ? 'bg-brand-teal-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
                Wedding
            </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-400">3. Location</label>
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
            <button 
                onClick={() => onLocationTypeChange('Indoor')}
                className={`flex justify-center items-center p-2.5 rounded-md text-sm font-semibold transition-colors ${locationType === 'Indoor' ? 'bg-brand-teal-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
                Indoor
            </button>
             <button 
                onClick={() => onLocationTypeChange('Outdoor')}
                className={`flex justify-center items-center p-2.5 rounded-md text-sm font-semibold transition-colors ${locationType === 'Outdoor' ? 'bg-brand-teal-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
                Outdoor
            </button>
        </div>
      </div>

       <div className="space-y-2">
        <label htmlFor="theme" className="text-sm font-medium text-slate-600 dark:text-slate-400 block">4. Theme</label>
         <select
          id="theme"
          className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-brand-teal-500/50 focus:border-brand-teal-500 transition-colors appearance-none bg-no-repeat"
          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
          value={theme}
          onChange={(e) => onThemeChange(e.target.value)}
        >
          {themeOptions.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-slate-600 dark:text-slate-400">5. Couple's Names & Details</label>
        <textarea
          id="description"
          rows={3}
          className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-brand-teal-500/50 focus:border-brand-teal-500 transition-colors"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder={"e.g., John & Jane\nSave the Date\n12.12.2025"}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block">6. Aspect Ratio</label>
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
        <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block">7. Number of Images</label>
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