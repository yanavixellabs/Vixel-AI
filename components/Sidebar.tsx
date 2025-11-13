import React from 'react';
import { ImagePosterIcon } from './icons/ImagePosterIcon';
import { WeddingIcon } from './icons/WeddingIcon';
import { DashboardIcon } from './icons/DashboardIcon';
import type { Suite } from '../App';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeSuite: Suite;
    onSuiteChange: (suite: Suite) => void;
}

const MenuItem: React.FC<{
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ isActive, onClick, children }) => {
    const baseClasses = "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors cursor-pointer";
    const activeClasses = "bg-brand-teal-50 dark:bg-brand-teal-950/60 text-brand-teal-600 dark:text-brand-teal-300 font-semibold";
    const inactiveClasses = "text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800";
    
    return (
         <li>
            <div onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
                {children}
            </div>
        </li>
    )
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeSuite, onSuiteChange }) => {
    
    const handleSuiteChange = (suite: Suite) => {
        onSuiteChange(suite);
        onClose(); // Close sidebar on selection, especially on mobile
    };

    return (
        <>
            {/* Overlay for mobile */}
            <div 
                className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>
            
            <nav className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-4 z-40 md:relative md:translate-x-0 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-10 px-2">
                    Vixel <span className="text-brand-teal-500">AI</span>
                </div>
                <ul className="space-y-2">
                     <MenuItem isActive={activeSuite === 'dashboard'} onClick={() => handleSuiteChange('dashboard')}>
                        <DashboardIcon />
                        <span>Dashboard</span>
                    </MenuItem>
                    <MenuItem isActive={activeSuite === 'poster'} onClick={() => handleSuiteChange('poster')}>
                        <ImagePosterIcon />
                        <span>Image Poster</span>
                    </MenuItem>
                     <MenuItem isActive={activeSuite === 'wedding'} onClick={() => handleSuiteChange('wedding')}>
                        <WeddingIcon />
                        <span>Wedding Suite</span>
                    </MenuItem>
                    {/* Future menu items can be added here */}
                </ul>
                <div className="mt-auto text-center text-slate-400 dark:text-slate-500 text-xs space-y-2">
                    <p>Version 1.0</p>
                    <div>
                        <p>
                            Copyright © {new Date().getFullYear()}{' '}
                            <a href="#" className="hover:text-brand-teal-500 transition-colors">
                                Vixellabs
                            </a>.
                        </p>
                        <p>All rights reserved.</p>
                    </div>
                </div>
            </nav>
        </>
    );
};