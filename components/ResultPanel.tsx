import React from 'react';
import type { GeneratedImage } from '../App';
import { RegenerateIcon } from './icons/RegenerateIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { ZoomIcon } from './icons/ZoomIcon';
import { ImagePosterIcon } from './icons/ImagePosterIcon';
import { LoadingSpinnerIcon } from './icons/LoadingSpinnerIcon';

interface ResultPanelProps {
  generatedImages: GeneratedImage[];
  isLoading: boolean;
  error: string | null;
  onRegenerateImage: (image: GeneratedImage) => void;
  regeneratingIds: Set<string>;
  onDownloadImage: (image: GeneratedImage) => void;
  onZoomImage: (image: GeneratedImage) => void;
  numImages: number;
  aspectRatio: string;
}

const ActionButton: React.FC<{ onClick: () => void; title: string; children: React.ReactNode }> = ({ onClick, title, children }) => (
    <button
        onClick={onClick}
        title={title}
        className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-sm text-white flex items-center justify-center border border-white/20 hover:bg-black/40 transition-all duration-300"
    >
        {children}
    </button>
);

const ImageCard: React.FC<{ 
    image: GeneratedImage; 
    index: number; 
    isRegenerating: boolean;
    onRegenerate: () => void;
    onDownload: () => void;
    onZoom: () => void;
    aspectRatioClass: string;
}> = ({ image, index, isRegenerating, onRegenerate, onDownload, onZoom, aspectRatioClass }) => (
    <div className={`relative bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden group animate-fade-in ${aspectRatioClass}`}>
        <img src={image.src} alt={`Generated Poster ${index + 1}`} className="w-full h-full object-contain" loading="lazy" />
        
        {isRegenerating && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-in">
                <LoadingSpinnerIcon className="h-5 w-5 text-white" />
                <span className="text-white text-sm ml-2 font-semibold">Regenerating...</span>
            </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {!isRegenerating && (
            <div className="absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300 transform translate-y-full group-hover:translate-y-0">
                <div className="flex items-center justify-center gap-3">
                    <ActionButton onClick={onZoom} title="Zoom"><ZoomIcon /></ActionButton>
                    <ActionButton onClick={onRegenerate} title="Regenerate"><RegenerateIcon /></ActionButton>
                    <ActionButton onClick={onDownload} title="Download"><DownloadIcon /></ActionButton>
                </div>
            </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
            <h4 className={`text-white text-sm font-semibold truncate transition-transform duration-300 transform ${!isRegenerating && 'group-hover:-translate-y-[60px]'}`}>{image.title}</h4>
        </div>
    </div>
);

const LoadingCard: React.FC<{ aspectRatioClass: string }> = ({ aspectRatioClass }) => (
    <div className={`relative bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden animate-fade-in flex flex-col items-center justify-center text-center p-4 ${aspectRatioClass}`}>
        <div className="animate-pulse-slow">
            <LoadingSpinnerIcon className="h-6 w-6 text-brand-teal-500" />
        </div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-3">Vixel AI is creating...</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">This may take a moment.</p>
    </div>
);

export const ResultPanel: React.FC<ResultPanelProps> = ({ generatedImages, isLoading, error, onRegenerateImage, regeneratingIds, onDownloadImage, onZoomImage, numImages, aspectRatio }) => {
  const showInitialState = !isLoading && !error && generatedImages.length === 0;

  const getAspectRatioClass = (ratio: string): string => {
    switch (ratio) {
        case '9:16': return 'aspect-[9/16]';
        case '16:9': return 'aspect-[16/9]';
        case '4:5': return 'aspect-[4/5]';
        default: return 'aspect-square'; // 1:1
    }
  };
  const aspectRatioClass = getAspectRatioClass(aspectRatio);

  const getGridClass = (): string => {
    return `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6`;
  };

  const gridClass = getGridClass();

  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col relative lg:flex-1 lg:overflow-y-auto">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-50 mb-6">Result</h2>
      
      <div className="flex-1">
        {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-500/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg" role="alert">
            <p>{error}</p>
            </div>
        )}

        {isLoading && (
            <div className={gridClass}>
            {[...Array(numImages)].map((_, i) => <LoadingCard key={i} aspectRatioClass={aspectRatioClass} />)}
            </div>
        )}

        {!isLoading && !error && generatedImages.length > 0 && (
            <div className={gridClass}>
            {generatedImages.map((image, index) => (
                <ImageCard 
                    key={image.id} 
                    image={image} 
                    index={index} 
                    isRegenerating={regeneratingIds.has(image.id)}
                    onRegenerate={() => onRegenerateImage(image)}
                    onDownload={() => onDownloadImage(image)}
                    onZoom={() => onZoomImage(image)}
                    aspectRatioClass={aspectRatioClass}
                />
            ))}
            </div>
        )}

        {showInitialState && (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 dark:text-slate-600 p-8">
                <div className="text-brand-teal-500/20">
                    <ImagePosterIcon />
                </div>
                <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400 mt-4">Your generated posters will appear here</h3>
                <p className="mt-1 text-sm">Upload and select an image, then click "Generate" to start.</p>
            </div>
        )}
      </div>
    </section>
  );
};
