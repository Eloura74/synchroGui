import React from 'react';

export const Chargement = ({ taille = 'normal' }) => {
  const tailleClasses = {
    petit: 'w-4 h-4',
    normal: 'w-8 h-8',
    grand: 'w-12 h-12'
  };

  return (
    <div className="flex justify-center items-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary ${tailleClasses[taille]}`}></div>
    </div>
  );
};
