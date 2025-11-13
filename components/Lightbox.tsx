import React from 'react';
import { CloseIcon } from './icons/CloseIcon';

interface LightboxProps {
  src: string | null;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-8 animate-fade-in"
      onClick={onClose}
    >
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white hover:text-slate-300 transition-colors z-[51]"
        aria-label="Close image preview"
      >
        <CloseIcon />
      </button>
      <div className="relative w-full h-full flex items-center justify-center">
        <img 
            src={src} 
            alt="Enlarged poster view" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()} // Prevent closing when clicking the image
        />
      </div>
    </div>
  );
};