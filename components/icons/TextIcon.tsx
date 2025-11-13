import React from 'react';

// FIX: Removed duplicate declarations of TextIcon and unused alternatives to fix redeclaration errors.
export const TextIcon: React.FC = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M9 6v12m6-12v12M3 18h18" />
    </svg>
);
