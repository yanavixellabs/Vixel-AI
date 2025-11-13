
import React, { useState, useEffect, useRef } from 'react';
import type { GeneratedImage } from '../App';
import { LoadingSpinnerIcon } from './icons/LoadingSpinnerIcon';
import { CloseIcon } from './icons/CloseIcon';
import { AlignLeftIcon } from './icons/AlignLeftIcon';
import { AlignCenterIcon } from './icons/AlignCenterIcon';
import { AlignRightIcon } from './icons/AlignRightIcon';
import { PaintBrushIcon } from './icons/PaintBrushIcon';
import { TextIcon } from './icons/TextIcon';
import { UndoIcon } from './icons/UndoIcon';
import { TrashIcon } from './icons/TrashIcon';
import { DrawingCanvas } from './DrawingCanvas';

type EditMode = 'text' | 'generative';
export interface TextStyleOptions {
  fontFamily: string;
  fontSize: 'Small' | 'Medium' | 'Large' | 'Extra Large';
  textAlign: 'Left' | 'Center' | 'Right';
}

interface EditModalProps {
  image: GeneratedImage;
  onClose: () => void;
  onSave: (imageId: string, finalSrc: string) => void;
  onApplyTextEdit: (imageId: string, currentSrc: string, newText: string, styleOptions: TextStyleOptions) => Promise<string>;
  onApplyGenerativeEdit: (currentSrc: string, prompt: string, maskBase64: string) => Promise<string>;
  isEditing: boolean;
  initialDescription: string;
}

const fontOptions = ['Inter', 'Poppins', 'Montserrat', 'Playfair Display', 'Roboto', 'Lato'];
const sizeOptions: TextStyleOptions['fontSize'][] = ['Small', 'Medium', 'Large', 'Extra Large'];
const alignmentOptions: { value: TextStyleOptions['textAlign']; icon: React.ReactNode }[] = [
    { value: 'Left', icon: <AlignLeftIcon /> },
    { value: 'Center', icon: <AlignCenterIcon /> },
    { value: 'Right', icon: <AlignRightIcon /> },
];

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-semibold transition-colors ${
            active ? 'bg-brand-teal-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
        }`}
    >
        {children}
    </button>
);


export const EditModal: React.FC<EditModalProps> = ({ image, onClose, onSave, onApplyTextEdit, onApplyGenerativeEdit, isEditing, initialDescription }) => {
  const [currentSrc, setCurrentSrc] = useState(image.src);
  const [mode, setMode] = useState<EditMode>('generative');
  
  // State for text editing
  const [newText, setNewText] = useState(initialDescription);
  const [fontFamily, setFontFamily] = useState('Inter');
  const [fontSize, setFontSize] = useState<TextStyleOptions['fontSize']>('Medium');
  const [textAlign, setTextAlign] = useState<TextStyleOptions['textAlign']>('Center');

  // State for generative editing
  const [generativePrompt, setGenerativePrompt] = useState('');
  const [brushSize, setBrushSize] = useState(40);
  const drawingCanvasRef = useRef<{ exportMask: () => string | null; clear: () => void; undo: () => void; }>(null);

  useEffect(() => {
    // Reset state when a new image is passed in
    setCurrentSrc(image.src);
    setNewText(initialDescription);
    setFontFamily('Inter');
    setFontSize('Medium');
    setTextAlign('Center');
    setGenerativePrompt('');
    drawingCanvasRef.current?.clear();
  }, [image, initialDescription]);


  const handleApplyClick = async () => {
    try {
        if (mode === 'text') {
            const styleOptions: TextStyleOptions = { fontFamily, fontSize, textAlign };
            const newSrc = await onApplyTextEdit(image.id, currentSrc, newText, styleOptions);
            setCurrentSrc(newSrc);
        } else { // 'generative'
            const mask = drawingCanvasRef.current?.exportMask();
            if (mask && generativePrompt) {
                const newSrc = await onApplyGenerativeEdit(currentSrc, generativePrompt, mask);
                setCurrentSrc(newSrc);
                drawingCanvasRef.current?.clear();
                setGenerativePrompt('');
            } else if (!generativePrompt) {
                alert('Please enter a description for the change.');
            } else {
                alert('Please draw a mask on the image to indicate the area to change.');
            }
        }
    } catch (e) {
        // Error is handled in App.tsx and displayed as a banner
        // No need for a local alert here.
    }
  };

  const handleSave = () => {
    onSave(image.id, currentSrc);
  };

  return (
    <div 
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={onClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col md:flex-row"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-full md:w-3/5 flex-shrink-0 p-6 flex items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-l-xl">
          <DrawingCanvas ref={drawingCanvasRef} src={currentSrc} brushSize={brushSize} enabled={mode === 'generative'} />
        </div>
        <div className="w-full md:w-2/5 flex flex-col p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-50">Customize Poster</h3>
                <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors">
                    <CloseIcon />
                </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 p-1 mb-6">
                <TabButton active={mode === 'text'} onClick={() => setMode('text')}><TextIcon /> Text Styles</TabButton>
                <TabButton active={mode === 'generative'} onClick={() => setMode('generative')}><PaintBrushIcon /> Generative Edit</TabButton>
            </div>
            
            <div className="flex-grow flex flex-col">
              {mode === 'text' && (
                  <div className="flex flex-col gap-4 animate-fade-in flex-grow">
                      <div className="flex gap-4">
                          <div className="flex-1 space-y-2">
                              <label htmlFor="font-family" className="text-sm font-medium text-slate-600 dark:text-slate-400 block">Font Family</label>
                              <select id="font-family" className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-teal-500/50 focus:border-brand-teal-500" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}>
                                  {fontOptions.map(font => <option key={font} value={font}>{font}</option>)}
                              </select>
                          </div>
                          <div className="flex-1 space-y-2">
                              <label htmlFor="font-size" className="text-sm font-medium text-slate-600 dark:text-slate-400 block">Font Size</label>
                              <select id="font-size" className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-teal-500/50 focus:border-brand-teal-500" value={fontSize} onChange={(e) => setFontSize(e.target.value as TextStyleOptions['fontSize'])}>
                                  {sizeOptions.map(size => <option key={size} value={size}>{size}</option>)}
                              </select>
                          </div>
                      </div>
                      <div>
                          <label className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-2">Alignment</label>
                          <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
                              {alignmentOptions.map(opt => (
                                  <button key={opt.value} onClick={() => setTextAlign(opt.value)} className={`flex justify-center items-center p-2.5 rounded-md text-sm font-semibold transition-colors ${textAlign === opt.value ? 'bg-white dark:bg-slate-700 shadow-sm text-brand-teal-600 dark:text-brand-teal-300' : 'text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`} title={`Align ${opt.value}`}>
                                      {opt.icon}
                                  </button>
                              ))}
                          </div>
                      </div>
                      <div className="space-y-2 flex-grow flex flex-col">
                          <label htmlFor="poster-text" className="text-sm font-medium text-slate-600 dark:text-slate-400">Poster Text</label>
                          <textarea id="poster-text" rows={5} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-teal-500/50 focus:border-brand-teal-500 flex-grow" value={newText} onChange={(e) => setNewText(e.target.value)} placeholder="Enter the new text for your poster..." />
                      </div>
                  </div>
              )}

              {mode === 'generative' && (
                  <div className="flex flex-col gap-4 animate-fade-in flex-grow">
                      <div className="space-y-2">
                          <label htmlFor="generative-prompt" className="text-sm font-medium text-slate-600 dark:text-slate-400">Describe your change</label>
                          <textarea id="generative-prompt" rows={3} className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-brand-teal-500/50 focus:border-brand-teal-500" value={generativePrompt} onChange={(e) => setGenerativePrompt(e.target.value)} placeholder="e.g., 'add a splash of water' or 'make the background a sunny beach'" />
                      </div>
                      <div className="space-y-2">
                          <label htmlFor="brush-size" className="text-sm font-medium text-slate-600 dark:text-slate-400 block">Brush Size ({brushSize}px)</label>
                          <input id="brush-size" type="range" min="10" max="100" step="2" value={brushSize} onChange={(e) => setBrushSize(Number(e.target.value))} className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-teal-500" />
                      </div>
                      <div className="flex items-center gap-2">
                          <button onClick={() => drawingCanvasRef.current?.undo()} className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-md text-sm font-semibold text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Undo">
                            <UndoIcon /> Undo
                          </button>
                          <button onClick={() => drawingCanvasRef.current?.clear()} className="flex-1 flex items-center justify-center gap-2 p-2.5 rounded-md text-sm font-semibold text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Clear Mask">
                              <TrashIcon /> Clear
                          </button>
                      </div>
                      <div className="flex-grow"></div>
                  </div>
              )}

              <div className="mt-4">
                  <button
                      onClick={handleApplyClick}
                      disabled={isEditing}
                      className="w-full flex items-center justify-center bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:bg-slate-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                      {isEditing ? (
                      <>
                          <LoadingSpinnerIcon className="-ml-1 mr-3 h-5 w-5 text-white" />
                          Applying...
                      </>
                      ) : (
                      'Apply'
                      )}
                  </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-auto pt-6">
                <button
                    onClick={onClose}
                    className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSave}
                    className="w-full flex items-center justify-center bg-brand-teal-500 hover:bg-brand-teal-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                   Save & Close
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};