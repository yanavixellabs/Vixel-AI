
import React, { useState, useRef, useCallback, useMemo } from 'react';
import { PlusIcon } from './icons/PlusIcon';

interface ImageUploadProps {
  files: File[];
  selectedFileIndex: number | null;
  onFilesChange: (files: File[]) => void;
  onSelect: (index: number) => void;
  maxFiles?: number;
}

const ImageThumbnail: React.FC<{
    file: File;
    isSelected: boolean;
    onSelect: () => void;
    onRemove: () => void;
}> = ({ file, isSelected, onSelect, onRemove }) => {
    const previewUrl = useMemo(() => URL.createObjectURL(file), [file]);

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove();
    };
    
    return (
        <div 
            className={`relative group aspect-square rounded-lg cursor-pointer overflow-hidden border-2 ${isSelected ? 'border-brand-teal-500' : 'border-transparent'}`}
            onClick={onSelect}
        >
            <img src={previewUrl} alt={file.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <button
                onClick={handleRemove}
                className="absolute top-1.5 right-1.5 h-6 w-6 bg-black/40 dark:bg-white/10 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 dark:hover:bg-white/20"
                aria-label="Remove image"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

const UploadSlot: React.FC<{ onFilesAdded: (addedFiles: File[]) => void; disabled: boolean; }> = ({ onFilesAdded, disabled }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFilesAdded(Array.from(e.target.files));
      // Reset input value to allow re-uploading the same file
      e.target.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (!disabled && e.dataTransfer.files) {
      onFilesAdded(Array.from(e.dataTransfer.files));
    }
  };

  if (disabled) return null;

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
        multiple
      />
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg cursor-pointer transition-colors
            ${isDragging ? 'border-brand-teal-500 bg-brand-teal-50 dark:bg-brand-teal-950/50' : 'border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
        >
            <div className="text-slate-400 dark:text-slate-500 group-hover:text-brand-teal-500 transition-colors">
                <PlusIcon />
            </div>
      </div>
    </>
  );
};

export const ImageUpload: React.FC<ImageUploadProps> = ({ files, selectedFileIndex, onFilesChange, onSelect, maxFiles = 4 }) => {
    
    const handleFilesAdded = useCallback((addedFiles: File[]) => {
        const imageFiles = addedFiles.filter(file => file.type.startsWith('image/'));
        const totalAfterAdd = files.length + imageFiles.length;
        const filesToAdd = totalAfterAdd > maxFiles ? imageFiles.slice(0, maxFiles - files.length) : imageFiles;
        
        if (filesToAdd.length > 0) {
            onFilesChange([...files, ...filesToAdd]);
        }
    }, [files, onFilesChange, maxFiles]);

    const handleRemove = useCallback((indexToRemove: number) => {
        onFilesChange(files.filter((_, i) => i !== indexToRemove));
    }, [files, onFilesChange]);

  const gridCols = maxFiles === 1 ? 'grid-cols-1' : 'grid-cols-2';

  return (
    <div className={`grid ${gridCols} gap-2`}>
      {files.map((file, index) => (
        <ImageThumbnail 
            key={`${file.name}-${index}`}
            file={file}
            isSelected={index === selectedFileIndex}
            onSelect={() => onSelect(index)}
            onRemove={() => handleRemove(index)}
        />
      ))}
      <UploadSlot 
        onFilesAdded={handleFilesAdded}
        disabled={files.length >= maxFiles}
      />
    </div>
  );
};