
import React, { useState, useCallback } from 'react';
import { WeddingControls, LocationType, ConceptType } from './WeddingControls';
import { ResultPanel } from './ResultPanel';
import { DownloadModal, DownloadOptions } from './DownloadModal';
import { Lightbox } from './Lightbox';
import { generateWeddingPosters, regenerateWeddingPoster } from '../services/geminiService';
import { fileToBase64, dataUrlToParts, downloadImageWithOptions } from '../utils/fileUtils';
import type { GeneratedImage } from '../App';

export const WeddingSuite: React.FC = () => {
  const [manFile, setManFile] = useState<File | null>(null);
  const [womanFile, setWomanFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>('John & Jane\nSave the Date\n12.12.2025');
  const [conceptType, setConceptType] = useState<ConceptType>('Prewedding');
  const [locationType, setLocationType] = useState<LocationType>('Outdoor');
  const [theme, setTheme] = useState<string>('Classic & Elegant');
  const [numImages, setNumImages] = useState(4);
  const [aspectRatio, setAspectRatio] = useState<string>('4:5');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [regeneratingIds, setRegeneratingIds] = useState(new Set<string>());
  const [error, setError] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [downloadingImage, setDownloadingImage] = useState<GeneratedImage | null>(null);

  const weddingConceptTitles = [
      'Enchanted Garden',
      'Urban Romance',
      'Classic Fairytale',
      'Seaside Serenity',
      'Modern Love Story',
      'Bohemian Dream',
  ];

  const handleGenerate = useCallback(async () => {
    if (!manFile || !womanFile) {
      setError('Please upload a photo for both the man and woman.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const manImageParts = await fileToBase64(manFile);
      const womanImageParts = await fileToBase64(womanFile);

      const results = await generateWeddingPosters(
        { base64: manImageParts.base64, mimeType: manImageParts.mimeType },
        { base64: womanImageParts.base64, mimeType: womanImageParts.mimeType },
        description,
        conceptType,
        locationType,
        theme,
        numImages,
        aspectRatio
      );
      
      setGeneratedImages(results.map((src, index) => ({ 
        src, 
        id: `wedding-${index}-${Date.now()}`,
        title: weddingConceptTitles[index % weddingConceptTitles.length] || `Concept ${index + 1}`
      })));
    } catch (err) {
      console.error(err);
      setError('Failed to generate posters. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [manFile, womanFile, description, conceptType, locationType, theme, numImages, aspectRatio]);

  const handleRegenerate = async (imageToRegenerate: GeneratedImage) => {
    if (!manFile || !womanFile) {
      setError('Please ensure the original couple photos are uploaded to regenerate.');
      return;
    }

    setRegeneratingIds(prev => new Set(prev).add(imageToRegenerate.id));
    setError(null);

    try {
        const manImageParts = await fileToBase64(manFile);
        const womanImageParts = await fileToBase64(womanFile);
        const { base64: existingPosterBase64 } = dataUrlToParts(imageToRegenerate.src);
        
        const newImageSrc = await regenerateWeddingPoster(
            { base64: manImageParts.base64, mimeType: manImageParts.mimeType },
            { base64: womanImageParts.base64, mimeType: womanImageParts.mimeType },
            existingPosterBase64,
            description,
            conceptType,
            locationType,
            theme,
            aspectRatio
        );

        setGeneratedImages(currentImages => 
            currentImages.map(img => 
                img.id === imageToRegenerate.id ? { ...img, src: newImageSrc } : img
            )
        );
    } catch (err) {
        console.error("Failed to regenerate poster:", err);
        setError("Failed to regenerate the poster. Please try again.");
    } finally {
        setRegeneratingIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(imageToRegenerate.id);
            return newSet;
        });
    }
  };

  const handleZoom = (src: string) => {
    setZoomedImage(src);
  };

  const handleStartDownload = (image: GeneratedImage) => {
    setDownloadingImage(image);
  };
  
  const handleCancelDownload = () => {
    setDownloadingImage(null);
  };

  const handleConfirmDownload = (options: DownloadOptions) => {
    if (downloadingImage) {
      downloadImageWithOptions(downloadingImage.src, {
        ...options,
        filename: `vixel-wedding-${downloadingImage.id}`,
      });
      setDownloadingImage(null);
    }
  };

  return (
    <>
      <WeddingControls
        manFile={manFile}
        onManFileChange={setManFile}
        womanFile={womanFile}
        onWomanFileChange={setWomanFile}
        description={description}
        onDescriptionChange={setDescription}
        conceptType={conceptType}
        onConceptTypeChange={setConceptType}
        locationType={locationType}
        onLocationTypeChange={setLocationType}
        theme={theme}
        onThemeChange={setTheme}
        onGenerate={handleGenerate}
        isLoading={isLoading}
        numImages={numImages}
        onNumImagesChange={setNumImages}
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
      />
      <ResultPanel 
        generatedImages={generatedImages}
        isLoading={isLoading}
        error={error}
        onRegenerateImage={handleRegenerate}
        regeneratingIds={regeneratingIds}
        onDownloadImage={handleStartDownload}
        onZoomImage={(image) => handleZoom(image.src)}
        numImages={numImages}
        aspectRatio={aspectRatio}
      />
      
      {downloadingImage && (
        <DownloadModal
          image={downloadingImage}
          onClose={handleCancelDownload}
          onDownload={handleConfirmDownload}
        />
      )}

      {zoomedImage && (
        <Lightbox 
          src={zoomedImage}
          onClose={() => setZoomedImage(null)}
        />
      )}
    </>
  );
};
