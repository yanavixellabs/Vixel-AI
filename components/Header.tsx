
import React from 'react';
import { MenuIcon } from './icons/MenuIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import type { Theme } from '../App';

interface HeaderProps {
    onMenuClick: () => void;
    title: string;
    theme: Theme;
    onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, title, theme, onToggleTheme }) => {
    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 p-4 sticky top-0 z-20 flex items-center gap-4 flex-shrink-0">
            <button onClick={onMenuClick} className="md:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <MenuIcon />
                <span className="sr-only">Open menu</span>
            </button>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h1>

            <button
                onClick={onToggleTheme}
                className="ml-auto text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
        </header>
    );
};