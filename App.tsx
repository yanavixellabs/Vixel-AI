import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ImagePosterSuite } from './components/ImagePosterSuite';
import { WeddingSuite } from './components/WeddingSuite';
import { Dashboard } from './components/Dashboard';

export type Suite = 'dashboard' | 'poster' | 'wedding';
export type Theme = 'light' | 'dark';
export interface GeneratedImage {
  src: string;
  id: string;
  title: string;
}

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSuite, setActiveSuite] = useState<Suite>('dashboard');
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const getTitle = () => {
    switch (activeSuite) {
      case 'wedding':
        return 'Wedding Suite';
      case 'poster':
        return 'Image Poster';
      case 'dashboard':
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="h-screen max-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans flex overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        activeSuite={activeSuite}
        onSuiteChange={setActiveSuite}
      />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header 
            onMenuClick={() => setIsSidebarOpen(true)} 
            title={getTitle()}
            theme={theme}
            onToggleTheme={toggleTheme}
        />
        
        <main className="flex-1 flex flex-col p-6 overflow-y-auto">
          {activeSuite === 'dashboard' && <Dashboard onSuiteChange={setActiveSuite} />}
          {activeSuite === 'poster' && <div className="flex flex-1 flex-col lg:flex-row gap-6 lg:overflow-hidden"><ImagePosterSuite /></div>}
          {activeSuite === 'wedding' && <div className="flex flex-1 flex-col lg:flex-row gap-6 lg:overflow-hidden"><WeddingSuite /></div>}
        </main>
      </div>
    </div>
  );
};

export default App;