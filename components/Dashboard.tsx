import React from 'react';
import type { Suite } from '../App';
import { ProjectsIcon } from './icons/ProjectsIcon';
import { ImagesIcon } from './icons/ImagesIcon';
import { StylesIcon } from './icons/StylesIcon';
import { ImagePosterIcon } from './icons/ImagePosterIcon';
import { WeddingIcon } from './icons/WeddingIcon';

interface DashboardProps {
    onSuiteChange: (suite: Suite) => void;
}

const StatCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    value: string;
    color: string;
}> = ({ icon, title, value, color }) => (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
        </div>
    </div>
);

const RecentActivityItem: React.FC<{
    icon: React.ReactNode;
    title: string;
    suite: string;
    date: string;
}> = ({ icon, title, suite, date }) => (
    <tr>
        <td className="p-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center text-brand-teal-500 bg-brand-teal-50 dark:bg-brand-teal-950/50 rounded-md">
                    {icon}
                </div>
                <span className="font-semibold text-slate-700 dark:text-slate-200 truncate">{title}</span>
            </div>
        </td>
        <td className="p-4 text-slate-500 dark:text-slate-400 hidden sm:table-cell">{suite}</td>
        <td className="p-4 text-slate-500 dark:text-slate-400 text-right">{date}</td>
    </tr>
);

const BarChart: React.FC<{ data: number[] }> = ({ data }) => {
    const max = Math.max(...data);
    return (
        <div className="flex items-end justify-between h-40 gap-2">
            {data.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                        className="w-full bg-brand-teal-400/80 hover:bg-brand-teal-400 rounded-t-sm transition-all"
                        style={{ height: `${(value / max) * 100}%` }}
                        title={`${value} generations`}
                    ></div>
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                    </span>
                </div>
            ))}
        </div>
    );
};


export const Dashboard: React.FC<DashboardProps> = ({ onSuiteChange }) => {
    
    const chartData = [12, 19, 3, 5, 2, 8, 15];

    return (
        <div className="w-full animate-fade-in space-y-6">
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-brand-teal-500 to-brand-teal-600 rounded-xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Welcome Back to Vixel AI!</h1>
                <p className="text-brand-teal-100 max-w-2xl mb-6">Ready to create something amazing? Jump into one of our suites or check out your recent activity below.</p>
                <button 
                    onClick={() => onSuiteChange('poster')}
                    className="bg-white text-brand-teal-600 font-bold py-2.5 px-5 rounded-lg hover:bg-brand-teal-50 transition-colors shadow"
                >
                    Create New Poster
                </button>
            </div>
            
            {/* Main Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <StatCard icon={<ProjectsIcon />} title="Projects Created" value="12" color="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300" />
                <StatCard icon={<ImagesIcon />} title="Images Generated" value="148" color="bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300" />
                <StatCard icon={<StylesIcon />} title="Favorite Style" value="Minimalist" color="bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Recent Activity</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="p-4">Project</th>
                                    <th className="p-4 hidden sm:table-cell">Suite</th>
                                    <th className="p-4 text-right">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <RecentActivityItem icon={<ImagePosterIcon />} title="Skincare Summer Promo" suite="Image Poster" date="2h ago" />
                                <RecentActivityItem icon={<WeddingIcon />} title="John & Jane's Invite" suite="Wedding Suite" date="1d ago" />
                                <RecentActivityItem icon={<ImagePosterIcon />} title="Coffee Shop Special" suite="Image Poster" date="3d ago" />
                                <RecentActivityItem icon={<ImagePosterIcon />} title="New Headphone Launch" suite="Image Poster" date="5d ago" />
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Usage Chart */}
                <div className="bg-white dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Weekly Generations</h2>
                    <BarChart data={chartData} />
                </div>
            </div>
        </div>
    );
};