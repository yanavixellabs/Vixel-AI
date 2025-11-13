import React, { useState, useRef, useEffect } from 'react';

const StylePreviews: { [key: string]: React.ReactNode } = {
  'Minimalist': <div className="w-full h-full bg-slate-100 flex items-center justify-center"><div className="w-2 h-2 bg-slate-800 rounded-full"></div></div>,
  'Studio Mode': <div className="w-full h-full" style={{background: 'radial-gradient(circle, #f1f5f9 0%, #d1d5db 100%)'}}></div>,
  'Modern / Corporate': <div className="w-full h-full bg-blue-900 p-1 flex flex-col justify-around"><div className="w-full h-1 bg-slate-100/80 rounded-sm"></div><div className="w-3/4 h-1 bg-slate-100/80 rounded-sm"></div><div className="w-1/2 h-1 bg-slate-100/80 rounded-sm"></div></div>,
  'Flat Design': <div className="w-full h-full bg-emerald-500 flex items-end justify-end p-1"><div className="w-1/2 h-1/2 bg-emerald-300"></div></div>,
  'Gradient / Neo-Modern': <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500"></div>,
  'Retro / Vintage': <div className="w-full h-full bg-[#f3eac2] flex items-center justify-center"><span className="font-serif text-[#4a3f35] text-xs font-bold">R</span></div>,
  'Bold / Typographic': <div className="w-full h-full bg-slate-900 flex items-center justify-center"><span className="text-white font-extrabold text-sm">Aa</span></div>,
  'Geometric / Abstract': <div className="w-full h-full bg-slate-100 flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 20 20" className="text-amber-400"><path d="M0 0 L10 20 L20 0 Z" fill="currentColor"></path></svg></div>,
  'Organic / Natural': <div className="w-full h-full bg-green-100 flex items-center justify-center"><svg width="20" height="20" viewBox="0 0 100 100"><path d="M 20,80 C 20,20 80,20 80,80" stroke="#166534" fill="transparent" strokeWidth="8"/></svg></div>,
  'Futuristic / Tech': <div className="w-full h-full bg-slate-900" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>,
  'Grunge / Urban': <div className="w-full h-full bg-slate-700 opacity-75" style={{ backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><g fill="%2394a3b8" opacity="0.4"><rect x="10" y="30" width="10" height="1" /><rect x="40" y="50" width="10" height="1" transform="rotate(45 45 50.5)" /><rect x="60" y="10" width="10" height="1" transform="rotate(-30 65 10.5)"/></g></svg>')`}}></div>,
  'Playful / Colorful': <div className="w-full h-full bg-yellow-200 flex items-center justify-center gap-0.5"><div className="w-2 h-2 rounded-full bg-pink-500"></div><div className="w-2 h-2 rounded-full bg-blue-500"></div><div className="w-2 h-2 rounded-full bg-green-500"></div></div>,
  'Luxury / Elegant': <div className="w-full h-full bg-slate-800 border-2 border-amber-400"></div>,
  'Artistic / Illustrative': <div className="w-full h-full bg-white flex items-center justify-center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>,
  'Editorial / Layout Focused': <div className="w-full h-full bg-white p-1 flex flex-col gap-0.5"><div className="w-1/2 h-2 bg-slate-900 rounded-sm"></div><div className="w-full h-1 bg-slate-300 rounded-sm"></div><div className="w-full h-1 bg-slate-300 rounded-sm"></div><div className="w-3/4 h-1 bg-slate-300 rounded-sm"></div></div>,
  'Experimental / Abstract Expression': <div className="w-full h-full bg-red-500" style={{clipPath: 'polygon(0% 0%, 100% 20%, 70% 100%, 0% 80%)'}}></div>,
};

interface StyleSelectorProps {
    label: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ label, options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);
    
    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
    }
    
    return (
        <div className="relative" ref={wrapperRef}>
            <label htmlFor="design-style-button" className="text-sm font-medium text-slate-600 dark:text-slate-400 block mb-2">{label}</label>
            <button
                id="design-style-button"
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-brand-teal-500/50 focus:border-brand-teal-500 transition-colors flex justify-between items-center"
            >
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded overflow-hidden flex-shrink-0 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900">
                        {StylePreviews[value]}
                    </div>
                    <span className="truncate">{value}</span>
                </div>
                 <svg className={`h-5 w-5 text-slate-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'><path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/></svg>
            </button>

            {isOpen && (
                <div className="absolute z-10 top-full mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto animate-fade-in" role="listbox">
                    <ul className="p-1">
                        {options.map(option => (
                            <li key={option}>
                                <button
                                    onClick={() => handleSelect(option)}
                                    className={`w-full text-left flex items-center gap-3 p-2.5 rounded-md text-sm transition-colors ${
                                        value === option 
                                        ? 'bg-brand-teal-50 dark:bg-brand-teal-950/60 text-brand-teal-600 dark:text-brand-teal-300 font-semibold'
                                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                                >
                                     <div className="w-8 h-8 rounded-md overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900">
                                        {StylePreviews[option]}
                                    </div>
                                    <span className="truncate">{option}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
};
