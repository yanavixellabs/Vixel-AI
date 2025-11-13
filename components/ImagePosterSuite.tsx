import React, { useState, useCallback } from 'react';
import { GeneratorControls } from './GeneratorControls';
import { ResultPanel } from './ResultPanel';
import { DownloadModal, DownloadOptions } from './DownloadModal';
import { Lightbox } from './Lightbox';
import { generatePosters, regeneratePoster, generateMagicDescription } from '../services/geminiService';
import { fileToBase64, dataUrlToParts, downloadImageWithOptions } from '../utils/fileUtils';
import type { GeneratedImage } from '../App';

export const ImagePosterSuite: React.FC = () => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [description, setDescription] = useState<string>('KULIT CERAH DAN TERLINDUNGI\nKulit lebih cerah dan sehat\nPROMO BELI 1 GRATIS 1');
  const [style, setStyle] = useState<string>('Minimalist');
  const [numImages, setNumImages] = useState(4);
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState<boolean>(false);
  const [regeneratingIds, setRegeneratingIds] = useState(new Set<string>());
  const [error, setError] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [downloadingImage, setDownloadingImage] = useState<GeneratedImage | null>(null);

  const productConceptTitles = [
      'Minimalist Elegance',
      'Vibrant Energy',
      'Natural & Organic',
      'Sophisticated Luxury',
      'Playful & Fun',
      'Artistic Interpretation',
  ];
  
  const handleFilesChange = (newFiles: File[]) => {
    setImageFiles(newFiles);
    if (selectedImageIndex !== null && selectedImageIndex >= newFiles.length) {
        setSelectedImageIndex(newFiles.length > 0 ? 0 : null);
    }
    if (selectedImageIndex === null && newFiles.length > 0) {
        setSelectedImageIndex(0);
    }
     if (newFiles.length === 0) {
        setSelectedImageIndex(null);
    }
  };

  const handleSelectImage = (index: number) => {
    setSelectedImageIndex(index);
  };
  
  const handleGenerate = useCallback(async () => {
    if (imageFiles.length === 0) {
      setError('Please upload at least one image first.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      const imageDatas = await Promise.all(imageFiles.map(file => fileToBase64(file)));
      const imagesToGenerate = imageDatas.map(({ base64, mimeType }) => ({ base64, mimeType }));
      const results = await generatePosters(imagesToGenerate, description, style, numImages, aspectRatio);

      setGeneratedImages(results.map((src, index) => ({ 
        src, 
        id: `poster-${index}-${Date.now()}`,
        title: productConceptTitles[index % productConceptTitles.length] || `Concept ${index + 1}`
      })));
    } catch (err) {
      console.error(err);
      setError('Failed to generate posters. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFiles, description, style, numImages, aspectRatio]);

  const handleMagicDescription = useCallback(async () => {
    if (selectedImageIndex === null || !imageFiles[selectedImageIndex]) {
      setError('Please upload and select an image to use Magic AI.');
      return;
    }
    const imageFile = imageFiles[selectedImageIndex];
    
    setIsGeneratingDescription(true);
    setError(null);

    try {
      const { base64, mimeType } = await fileToBase64(imageFile);
      const newDescription = await generateMagicDescription(base64, mimeType);
      setDescription(newDescription);
    } catch (err) {
      console.error(err);
      setError('Magic AI failed to generate a description. Please try again.');
    } finally {
      setIsGeneratingDescription(false);
    }
  }, [imageFiles, selectedImageIndex]);

  const handleRegenerate = async (imageToRegenerate: GeneratedImage) => {
    if (imageFiles.length === 0) {
      setError('Please ensure original product images are uploaded to regenerate.');
      return;
    }

    setRegeneratingIds(prev => new Set(prev).add(imageToRegenerate.id));
    setError(null);

    try {
        const productImages = await Promise.all(
            imageFiles.map(file => fileToBase64(file))
        );
        const imagesForRegeneration = productImages.map(({ base64, mimeType }) => ({ base64, mimeType }));
        const { base64: existingPosterBase64 } = dataUrlToParts(imageToRegenerate.src);

        const newImageSrc = await regeneratePoster(
            imagesForRegeneration,
            existingPosterBase64,
            description,
            style,
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
        filename: `vixel-poster-${downloadingImage.id}`,
      });
      setDownloadingImage(null);
    }
  };

  return (
    <>
      <GeneratorControls
        imageFiles={imageFiles}
        selectedImageIndex={selectedImageIndex}
        onFilesChange={handleFilesChange}
        onSelectImage={handleSelectImage}
        description={description}
        onDescriptionChange={setDescription}
        style={style}
        onStyleChange={setStyle}
        onGenerate={handleGenerate}
        isLoading={isLoading}
        isGeneratingDescription={isGeneratingDescription}
        onMagicDescription={handleMagicDescription}
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
